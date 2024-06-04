import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [checked, setChecked] = useState(false);
  const [options, setOptions] = useState(1);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`); 
    setQrCodeData(data);
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
        <View>
          <Button title={'Tap to Scan Again'} onPress={() => {setScanned(false); setOptions(1)} } /> 
          <Text>
            {qrCodeData}
            <Button title={'Buy'} onPress={() => setOptions(3)} /> 
          </Text>
        </View>
    );
    case 3: 
      return (
        <View>
          <Text> Payment fulfilled  </Text>
          <Button title={'New purchases'} onPress={() => {setOptions(1); setScanned(false);}}/> 
        </View>
      )
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
    flexDirection: 'column',
    justifyContent: 'center',
  },

});
