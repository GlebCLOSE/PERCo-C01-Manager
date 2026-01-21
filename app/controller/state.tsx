import { Text, View } from "react-native";
import { ExdevState } from "../../components/ui/blocks/exdevState";

export default function StateScreen() {
    return (
        <>
            <Text>Состояние</Text>
            <View>
                <Text>Испольнительные устройства</Text>
                <ExdevState 
                    number={0}
                    type={'lock'}
                    acm={'control'}
                    status={'locked'}
                    pass={'normal'}
                />
                <ExdevState 
                    number={1}
                    type={'lock'}
                    acm={'open'}
                    status={'unlocked'}
                    pass={'active'}
                />
            </View>
            
        </>
    );
}