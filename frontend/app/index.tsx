import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from "./utils/authContext";

export default async function Index() {

  return (
    <AuthProvider>
      <PaperProvider>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link style={styles.button} href={'./auth/login'}>
            <Text style={styles.text}>Get Started</Text>
          </Link>
        </View>
      </PaperProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
