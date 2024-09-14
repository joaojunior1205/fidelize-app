import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions, useNavigation } from '@react-navigation/native';

type HeaderProps = {
  title: string;
  showAddButton?: boolean;
  onAddPress?: () => void;
  addButtonIcon?: keyof typeof Ionicons.glyphMap;
};

export default function Header({ title, showAddButton, onAddPress, addButtonIcon = "add" }: HeaderProps) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} style={styles.menuButton}>
          <Ionicons name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        {showAddButton ? (
          <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
            <Ionicons name={addButtonIcon} size={24} color="black" />
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f8f8f8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f8f8', // Adicionado para garantir um fundo opaco
  },
  menuButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
});