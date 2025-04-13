import React, { useState, useEffect} from "react";
import SimpleHeader from "@/Components/SimpleHeader";
import useGetLoginContext from "@/Context/LoginContext";
import { useRouter } from "expo-router";
import { Text, View, ScrollView, StyleSheet, FlatList } from "react-native";
import FilterBand from "@/Components/Contracts/FilterBand";
import { ContractType } from "@/Context/types";
import ContractCard from "@/Components/Contracts/ContractCard";
import { app_colors } from "@/assets/styles/colors";
const contractings: ContractType[] = [
  {
    contractID: "C001",
    farmerID: "Genius K Mutusva",
    buyerID: "GreenHarvest Ltd",
    agreement: "Buy 200kg of maize at $0.30/kg",
    status: true,
    startDate: "2025-04-01",
    finishDate: "2025-05-15"
  },
  {
    contractID: "C002",
    farmerID: "Public",
    buyerID: "Fresh Foods Co",
    agreement: "Supply 100 crates of tomatoes weekly",
    status: false,
    startDate: "2025-03-01",
    finishDate: "2025-06-01"
  },
  {
    contractID: "C003",
    farmerID: "Nyasha Dube",
    buyerID: "ZimMarket Traders",
    agreement: "Deliver 50kg of groundnuts bi-weekly",
    status: true,
    startDate: "2025-04-10",
    finishDate: "2025-06-10"
  },
  {
    contractID: "C004",
    farmerID: "Genius K Mutusva",
    buyerID: "Fresh Picks Zimbabwe",
    agreement: "Supply 500 bundles of spinach at $0.10/bundle",
    status: false,
    startDate: "2025-02-20",
    finishDate: "2025-04-10"
  },
  {
    contractID: "C005",
    farmerID: "Public",
    buyerID: "AgroLink Wholesalers",
    agreement: "Purchase 100kg of sweet potatoes",
    status: true,
    startDate: "2025-04-05",
    finishDate: "2025-05-15"
  },
  {
    contractID: "C006",
    farmerID: "Chipo Gondo",
    buyerID: "Sunrise Retailers",
    agreement: "Weekly delivery of 30 trays of eggs",
    status: true,
    startDate: "2025-04-12",
    finishDate: "2025-07-12"
  },
  {
    contractID: "C007",
    farmerID: "Genius K Mutusva",
    buyerID: "DailyDairy Distributors",
    agreement: "Supply 120 liters of milk daily",
    status: false,
    startDate: "2025-01-15",
    finishDate: "2025-03-15"
  },
  {
    contractID: "C008",
    farmerID: "Public",
    buyerID: "BulkBuy Africa",
    agreement: "Purchase 300kg of potatoes",
    status: true,
    startDate: "2025-04-09",
    finishDate: "2025-06-09"
  },
  {
    contractID: "C009",
    farmerID: "Genius K Mutusva",
    buyerID: "Organic Pantry",
    agreement: "Monthly delivery of 100 liters of honey",
    status: true,
    startDate: "2025-03-01",
    finishDate: "2025-07-01"
  },
  {
    contractID: "C010",
    farmerID: "Linda Mukwesha",
    buyerID: "FarmDirect Stores",
    agreement: "Supply 200kg of onions bi-weekly",
    status: false,
    startDate: "2025-01-10",
    finishDate: "2025-03-20"
  }
];

const line = <View style={{
        width: "97%",
        height: 0.75,
        backgroundColor: app_colors.dark_cardbg,
        marginHorizontal: "auto",
        marginVertical: 5
    }}
/>

export default function Contracts()
{
    const { state : login } = useGetLoginContext();
    const navigate = useRouter();
    const [selected, setSelected] = useState<number>(0);
    const [contracts, setContracts] = useState<ContractType[]>(contractings);

    useEffect(() =>
    {
        selected === 0 ? setContracts(contractings)
        : selected === 1 ? setContracts(contractings.filter(contract => contract.farmerID === "Public"))
            : selected === 2 ?  setContracts(contractings.filter(contract => contract.farmerID == "Genius Kudzanai Mutusva" && !contract.status))
                :selected === 3 ? setContracts(contractings.filter(contract => contract.farmerID == "Genius Kudzanai Mutusva" && contract.status === true))
                    : alert("There Are No Contracts")

    }, [selected])
    return(
        <>
            <SimpleHeader
                title={ "Contracts" }
                back={() => {
                    const retreat  = login.user_type === "Buyers" ? "(buyers)/BuyerHome" : "(farmer)/FarmerHome";
                    navigate.push(`/Drawer/${ retreat }`);
                }}
            />
            <FilterBand type="Farmers" selected={ selected } setSelected={ setSelected }/>
            <ScrollView>
                <FlatList
                    data={ contracts }
                    renderItem={({ item }) => <ContractCard contract={ item } type="Farmers"/> }
                    ItemSeparatorComponent={ line }
                />
            </ScrollView>
        </>
    )
}