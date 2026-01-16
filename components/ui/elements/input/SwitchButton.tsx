import React, {useState} from 'react';

import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';

interface CustomSwitchProps {
    selectionMode: 1 | 2;
    roundCorner: boolean;
    option1: string;
    option2: string;
    onSelectSwitch: () => {};
    selectionColor: string;
}

export const CustomSwitch: React.FC<CustomSwitchProps> = ({
  selectionMode,
  roundCorner,
  option1,
  option2,
  onSelectSwitch,
  selectionColor
}) => {
  const [getSelectionMode, setSelectionMode] = useState(selectionMode);
  const [getRoundCorner, setRoundCorner] = useState(roundCorner);

  const updatedSwitchData = (val) => {
    setSelectionMode(val);
    onSelectSwitch(val);
  };

  const styles = StyleSheet.create ({
    container: {
        height: 44,
        width: 215,
        backgroundColor: '#fff',
        borderRadius: getRoundCorner ? 25 : 0,
        borderWidth: 1,
        borderColor: selectionColor,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 2,
    },
    firstButton: {
        flex: 1,
        backgroundColor: getSelectionMode == 1 ? selectionColor : '#fff',
        borderRadius: getRoundCorner ? 25 : 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondButton: {
        flex: 1,
        backgroundColor: getSelectionMode == 2 ? selectionColor : '#fff',
        borderRadius: getRoundCorner ? 25 : 0,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

  return (
    <View>
      <View
        style={{
          height: 44,
          width: 215,
          backgroundColor: '#fff',
          borderRadius: getRoundCorner ? 25 : 0,
          borderWidth: 1,
          borderColor: selectionColor,
          flexDirection: 'row',
          justifyContent: 'center',
          padding: 2,
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(1)}
          style={{
            flex: 1,

            backgroundColor: getSelectionMode == 1 ? selectionColor : '#fff',
            borderRadius: getRoundCorner ? 25 : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: getSelectionMode == 1 ? '#fff' : selectionColor,
            }}>
            {option1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => updatedSwitchData(2)}
          style={{
            flex: 1,

            backgroundColor: getSelectionMode == 2 ? selectionColor : '#fff',
            borderRadius: getRoundCorner ? 25 : 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: getSelectionMode == 2 ? '#fff' : selectionColor,
            }}>
            {option2}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

