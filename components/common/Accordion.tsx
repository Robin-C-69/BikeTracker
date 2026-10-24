import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { makeStyles, useTheme } from "@/hooks/useThemedStyles";

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
  style?: StyleProp<ViewStyle>;
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
  style?: StyleProp<ViewStyle>;
}

export function AccordionItem({ value, children, style }: AccordionItemProps) {
  const styles = useStyles();
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
  style?: StyleProp<ViewStyle>;
}

export function AccordionHeader({ children, style }: AccordionHeaderProps) {
  const styles = useStyles();
  return <View style={[styles.header, style]}>{children}</View>;
}

// ─── AccordionTrigger ───────────────────────────────────────────────────────

interface AccordionTriggerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  chevron?: React.ReactNode;
}

export function AccordionTrigger({
  children,
  style,
  chevron,
}: AccordionTriggerProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { toggle } = useAccordionContext();
  const { value, isOpen } = useAccordionItemContext();

  const [rotation] = useState(() => new Animated.Value(isOpen ? 1 : 0));

  useEffect(() => {
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
      accessibilityRole="button"
      accessibilityState={{ expanded: isOpen }}
      activeOpacity={0.7}
      onPress={() => toggle(value)}
      style={[styles.trigger, style]}
    >
      <View style={styles.triggerContent}>{children}</View>
      <Animated.View style={[styles.chevron, { transform: [{ rotate }] }]}>
        {chevron ?? (
          <Ionicons
            name="chevron-down"
            size={16}
            color={theme.colors.text.tertiary}
          />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

// ─── AccordionContent ───────────────────────────────────────────────────────

interface AccordionContentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function AccordionContent({ children, style }: AccordionContentProps) {
  const styles = useStyles();
  const { isOpen } = useAccordionItemContext();

  // const animatedHeight = useRef(new Animated.Value(0)).current;
  // const animatedOpacity = useRef(new Animated.Value(0)).current;
  const [height] = useState(() => new Animated.Value(0));
  const [opacity] = useState(() => new Animated.Value(0));
  const [contentHeight, setContentHeight] = useState(0);
  // const [measured, setMeasured] = useState(false);
  const hasMeasured = useRef(false);

  // Measure content height once
  const onLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h === contentHeight) return;
    if (!hasMeasured.current) {
      hasMeasured.current = true;
      // Already open on first measure: jump to the open state, no animation.
      if (isOpen) {
        height.setValue(h);
        opacity.setValue(1);
      }
    }
    setContentHeight(h);
  };

  useEffect(() => {
    if (!hasMeasured.current) return;
    Animated.parallel([
      Animated.timing(height, {
        toValue: isOpen ? contentHeight : 0,
        duration: 280,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: isOpen ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isOpen, contentHeight, height, opacity]);

  return (
    <Animated.View
      accessibilityElementsHidden={!isOpen}
      importantForAccessibility={isOpen ? "auto" : "no-hide-descendants"}
      style={[styles.contentWrapper, { height, opacity }]}
    >
      <View style={styles.measureLayer} onLayout={onLayout}>
        <View style={[styles.content, style]}>{children}</View>
      </View>
    </Animated.View>
  );
}

// ─── AccordionTitleText ──────────────────────────────────────────────────────

interface AccordionTitleTextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export function AccordionTitleText({
  children,
  style,
}: AccordionTitleTextProps) {
  const styles = useStyles();
  return <Text style={[styles.titleText, style]}>{children}</Text>;
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const useStyles = makeStyles((theme) => ({
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
  // defaultChevron: {
  //   fontSize: 16,
  //   color: theme.colors.text.tertiary,
  //   marginLeft: 8,
  // },
  contentWrapper: {
    overflow: "hidden",
  },
  measureLayer: { position: "absolute", left: 0, right: 0 },
  content: {
    paddingBottom: 12,
  },
  titleText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.regular,
    color: theme.colors.text.tertiary,
  },
  chevron: { marginLeft: 8 },
}));
