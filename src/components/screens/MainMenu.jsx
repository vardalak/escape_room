import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { commonStyles } from '../../styles/commonStyles';

export default function MainMenu() {
  return (
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Escape Room</Text>
      <Text style={commonStyles.subtitle}>Welcome to your new game!</Text>

      <View style={commonStyles.card}>
        <Text style={commonStyles.infoText}>
          This is your main menu. Start building your game from here!
        </Text>
      </View>

      <TouchableOpacity style={commonStyles.button}>
        <Text style={commonStyles.buttonText}>Start Game</Text>
      </TouchableOpacity>
    </View>
  );
}
