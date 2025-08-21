import { StyleSheet, View } from 'react-native';
import { DatabaseProvider } from './context/DatabaseContext';

export default function App() {
  return (
    <DatabaseProvider>
      <View style={styles.container}>
        {/* Your app content */}
      </View>
    </DatabaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 