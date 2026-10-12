import React, { createContext, useContext, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

// ─── Context ────────────────────────────────────────────────────────────────

type AccordionType = "single" | "multiple";

interface AccordionContextValue {
  type: AccordionType;
  openItems: Set<string>;
  toggle: (value: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

const useAccordionContext = () => {
  const ctx = useContext(AccordionContext);
  if (!ctx)
    throw new Error("Accordion components must be used inside <Accordion>");
  return ctx;
};

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(
  null,
);

const useAccordionItemContext = () => {
  const ctx = useContext(AccordionItemContext);
  if (!ctx)
    throw new Error(
      "AccordionItem components must be used inside <AccordionItem>",
    );
  return ctx;
};

// ─── Accordion (root) ───────────────────────────────────────────────────────

interface AccordionProps {
  type?: AccordionType;
  defaultValue?: string | string[];
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Accordion({
  type = "single",
  defaultValue,
  children,
  style,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    if (!defaultValue) return new Set();
    return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
  });

  const toggle = (value: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(value)) {
        next.delete(value);
      } else {
        if (type === "single") next.clear();
        next.add(value);
      }
      return next;
    });
  };

  return (
    <AccordionContext.Provider value={{ type, openItems, toggle }}>
      <View style={style}>{children}</View>
    </AccordionContext.Provider>
  );
}

// ─── AccordionItem ──────────────────────────────────────────────────────────

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AccordionItem({ value, children, style }: AccordionItemProps) {
  const { openItems } = useAccordionContext();
  const isOpen = openItems.has(value);

  return (
    <AccordionItemContext.Provider value={{ value, isOpen }}>
      <View style={[styles.item, style]}>{children}</View>
    </AccordionItemContext.Provider>
  );
}

// ─── AccordionHeader ────────────────────────────────────────────────────────

interface AccordionHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AccordionHeader({ children, style }: AccordionHeaderProps) {
  return <View style={[styles.header, style]}>{children}</View>;
}

// ─── AccordionTrigger ───────────────────────────────────────────────────────

interface AccordionTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  chevron?: React.ReactNode;
}

export function AccordionTrigger({
  children,
  style,
  chevron,
}: AccordionTriggerProps) {
  const { toggle } = useAccordionContext();
  const { value, isOpen } = useAccordionItemContext();

  const rotation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(rotation, {
      toValue: isOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOpen, rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => toggle(value)}
      style={[styles.trigger, style]}
    >
      <View style={styles.triggerContent}>{children}</View>
      {chevron ? (
        <Animated.View style={{ transform: [{ rotate }] }}>
          {chevron}
        </Animated.View>
      ) : (
        <Animated.Text
          style={[styles.defaultChevron, { transform: [{ rotate }] }]}
        >
          <Ionicons name={"chevron-down"} />
        </Animated.Text>
      )}
    </TouchableOpacity>
  );
}

// ─── AccordionContent ───────────────────────────────────────────────────────

interface AccordionContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function AccordionContent({ children, style }: AccordionContentProps) {
  const { isOpen } = useAccordionItemContext();

  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const [measured, setMeasured] = useState(false);

  // Measure content height once
  const onLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0 && !measured) {
      setContentHeight(h);
      setMeasured(true);
      // If already open when first measured, jump to open state
      if (isOpen) {
        animatedHeight.setValue(h);
        animatedOpacity.setValue(1);
      }
    }
  };

  React.useEffect(() => {
    if (!measured) return;
    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: isOpen ? contentHeight : 0,
        duration: 280,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: isOpen ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isOpen, measured, contentHeight, animatedHeight, animatedOpacity]);

  return (
    <Animated.View
      style={[
        styles.contentWrapper,
        {
          height: measured ? animatedHeight : undefined,
          opacity: animatedOpacity,
        },
      ]}
    >
      {/* Hidden measurement layer */}
      {!measured && (
        <View style={styles.measureLayer} onLayout={onLayout}>
          <View style={[styles.content, style]}>{children}</View>
        </View>
      )}
      {/* Visible content (rendered after measurement) */}
      {measured && <View style={[styles.content, style]}>{children}</View>}
    </Animated.View>
  );
}

// ─── AccordionTitleText ──────────────────────────────────────────────────────

interface AccordionTitleTextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function AccordionTitleText({
  children,
  style,
}: AccordionTitleTextProps) {
  return <Text style={[styles.titleText, style]}>{children}</Text>;
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  item: {
    overflow: "hidden",
  },
  header: {
    backgroundColor: "transparent",
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 0.25,
    borderBottomColor: theme.colors.border.default,
  },
  triggerContent: {
    flex: 1,
  },
  defaultChevron: {
    fontSize: 16,
    color: theme.colors.text.tertiary,
    marginLeft: 8,
  },
  contentWrapper: {
    overflow: "hidden",
  },
  measureLayer: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
  },
  content: {
    paddingBottom: 12,
  },
  titleText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.text.tertiary,
  },
});
