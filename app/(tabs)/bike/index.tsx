import BikeCard from "@/client/components/bike/BikeCard";
import CustomHeader from "@/client/components/common/CustomHeader";
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";
import {useBike} from "@/client/hooks/useBike";
import {theme} from "@/client/constants/theme";

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const LEFT_INSET = 20; // Valeur de paddingHorizontal dans scrollContent
const RIGHT_INSET = 20; // Valeur de paddingHorizontal dans scrollContent

export default function Index() {
  const {bikes, loading, error} = useBike()

  const tempData = [
    {label: "bike1"},
    {label: "bike2"},
    {label: "bike3"},
    {label: "bike4"},
    {label: "bike5"},
    {label: "bike6"},
    {label: "bike7"},
    {label: "bike8"},
    {label: "bike9"},
    {label: "bike10"},
  ];

  return (
    <View style={styles.container}>
      <CustomHeader/>
      <View style={styles.listContainer}>
        <ScrollView
          horizontal={true}
          style={styles.scrollview}
          contentContainerStyle={styles.scrollContent}
          showsHorizontalScrollIndicator={false}
        >
          {tempData.map((bike) => <BikeCard key={bike.label} name={bike.label}/>)}
          <BikeCard name={"ADD BIKE"}/>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContainer: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  }
});