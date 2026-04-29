import { View, Text, StyleSheet } from "react-native"
import { useCallback, useState } from "react"
import { RememberedDevice } from "./rememberedDevice"
import { Button } from "../elements/buttons/Button"
import { useRouter, useFocusEffect } from "expo-router"
import { getDevices } from "../../../storage/deviceStorage"
import type { Device } from "../../../types/device"

export const ListOfDevices = () => {
    const router = useRouter()
    const [firstDevice, setFirstDevice] = useState<Device | null | undefined>(
        undefined
    )

    const refresh = useCallback(() => {
        void (async () => {
            const list = await getDevices()
            setFirstDevice(list[0] ?? null)
        })()
    }, [])

    useFocusEffect(
        useCallback(() => {
            refresh()
        }, [refresh])
    )

    return (
        <View style={styles.window}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Запомненные устройства</Text>
            </View>
            <View style={styles.list}>
                {firstDevice === undefined ? null : firstDevice ? (
                    <RememberedDevice
                        name={firstDevice.name}
                        ip={firstDevice.ip}
                        password={firstDevice.password ?? ""}
                        small={true}
                    />
                ) : (
                    <Text style={styles.emptyText}>
                        Нет запомненных устройств
                    </Text>
                )}
                <Button
                    title="Список устройств →"
                    onPress={() => router.push("/remembered")}
                    size="S"
                    customStyles={{
                        backgroundColor: "#ffffffe0",
                        borderWidth: 1,
                        borderColor: "#1A2253",
                        borderRadius: 5,
                        width: "100%",
                    }}
                    customTextStyles={{ color: "#1A2253" }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    window: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#00067033",
        backgroundColor: "#e8f8ff73",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.1)",
    },
    header: {
        backgroundColor: "#0A3A99",
        width: "100%",
        height: 34,
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 7,
    },
    headerText: {
        fontSize: 16,
        color: "#ffffffe0",
    },
    list: {
        flexDirection: "column",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 7,
        gap: 7,
    },
    emptyText: {
        alignSelf: "stretch",
        textAlign: "center",
        fontSize: 14,
        color: "#00067099",
        fontFamily: "inter",
        paddingVertical: 4,
    },
})
