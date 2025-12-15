import { useEffect } from "react";
import * as Updates from "expo-updates";

export function OTAUpdater() {
    useEffect(() => {
        async function run() {
            try {
                const update = await Updates.checkForUpdateAsync();

                if (update.isAvailable) {
                    console.log("⬇️ OTA disponível, baixando...");
                    await Updates.fetchUpdateAsync();
                    console.log("🔄 OTA aplicado, reiniciando app");
                    await Updates.reloadAsync();
                } else {
                    console.log("✅ App já está atualizado");
                }
            } catch (e) {
                console.log("⚠️ Erro ao checar OTA", e);
            }
        }

        run();
    }, []);

    return null;
}
