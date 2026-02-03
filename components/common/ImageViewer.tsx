import { ImageSourcePropType, StyleProp, StyleSheet } from "react-native";
import { Image, ImageStyle } from "expo-image";

type Props = {
  imgSource: ImageSourcePropType;
  selectedImage?: string;
  style?: StyleProp<ImageStyle>;
};

export default function ImageViewer({
  imgSource,
  selectedImage,
  style,
}: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  return <Image source={imageSource} style={style ? style : styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
  },
});
