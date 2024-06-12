import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
  TextInput,
  SafeAreaView,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

import {
  useFonts,
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from "@expo-google-fonts/roboto";

interface MyObj {
  s: string;
  v: number;
}

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<Array<MyObj>>([]);
  const [options, setOptions] = useState(4); // input login.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [total, setTotal] = useState(0);

  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Leitura do QRCode realizada com sucesso!`);
    const fruits: Array<MyObj> = [];
    let total: number = 0;

    const val: [] = data.split("_");
    let obj: MyObj;
    val.forEach((v) => {
      obj = JSON.parse(v);
      total = total + Number(obj.v);
      fruits.push(obj);
    });

    setTotal(total);
    setQrCodeData(fruits);
    setOptions(2);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  switch (options) {
    case 1:
      return (
        <View style={styles.container}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      );
    case 2:
      return (
        <View style={styles.container}>
          <Text style={styles.totalValue}>
            {"VALOR TOTAL: " + " R$" + total}
          </Text>
          <ScrollView>
            <View style={styles.display3}>
              {qrCodeData.map((f) => {
                return (
                  <View>
                    <View style={productsStyles.item}>
                      <Text style={styles.display1}>{f.s}</Text>
                      <Text style={styles.display2}>{"R$" + f.v} </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <Button title={"Comprar"} onPress={() => setOptions(3)} />
          <Text></Text>
          <Button
            title={"Ler outro QR-Code"}
            onPress={() => {
              setOptions(1);
            }}
          />
        </View>
      );

    case 3:
      return (
        <SafeAreaView style={menu.container}>
          <Text style={menu.title}>Sucesso!</Text>
          <View style={enter.container}>
            <Button
              title={"Clique aqui para realizar uma nova compra!"}
              onPress={() => setOptions(1)}
            />
          </View>
        </SafeAreaView>
      );
    case 4:
      return (
        <SafeAreaView style={menu.container}>
          <Text style={menu.title}>WeScale</Text>
          <TextInput
            placeholder="Login"
            value={email}
            onChangeText={(text) => setEmail(text)}
            keyboardType="email-address"
            style={menu.input}
          />
          <TextInput
            placeholder="Senha"
            value={password}
            onChangeText={(text) => setPassword(text)}
            keyboardType="visible-password"
            secureTextEntry
            style={menu.input}
            onSubmitEditing={() => alert("Welcome to GeeksforGeeks")}
          />
          <View style={enter.container}>
            <Button title={"Enter"} onPress={() => setOptions(1)} />
          </View>
        </SafeAreaView>
      );

    default:
      return (
        <View style={styles.container}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: "#dcdcdc",
  },
  item: {
    padding: 20,
    fontSize: 15,
    marginTop: 5,
  },
  display1: {
    fontFamily: "Roboto_700Bold",
    padding: 20,
    fontSize: 17,
    marginTop: 2,
    color: "blue",
    borderColor: "black",
  },
  display2: {
    fontFamily: "Roboto_700Bold_Italic",
    padding: 20,
    fontSize: 17,
    marginTop: 2,
    color: "blue",
    borderColor: "blue",
  },
  display3: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 30,
    borderColor: "black",
    borderWidth: 4,
  },
  display4: {
    backgroundColor: "white",
    borderRadius: 30,
  },
  totalValue: {
    color: "red",
    marginLeft: 40,
    padding: 5,
    fontFamily: "Roboto_900Black",
    fontSize: 19,
  },
  fontDif: {
    fontFamily: "Roboto_900Black",
    fontSize: 30,
    padding: 10,
  },
});

const productsStyles = StyleSheet.create({
  item: {
    flexDirection: "row",
  },
});

const menu = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#afeeee",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    color: "#fff",
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    width: "80%",
    marginTop: 15,
    color: "#000",
  },
});

const enter = StyleSheet.create({
  container: {
    padding: 20,
  },
});
