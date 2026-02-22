<script setup>
import { useUserStore } from "../stores/user";
import { useI18n } from "vue-i18n";

// 用t簡化替代使用useI18n()
const { t } = useI18n();

const userStore = useUserStore();

// 取出使用者資訊
const userInfo = userStore.userInfo;

</script>

<template>
    <v-container fluid class="member-page fill-height pa-0">
        <v-row class="fill-height ma-0" align="center" justify="center">
            <v-col cols="12" class="text-center">

                <p class="text-h3 font-weight-bold mb-2">
                    {{ t("PAGE.MEMBER.HELLO") }} {{ userInfo.name }}
                </p>
                <p class="text-h5 text-grey">
                    {{ t("PAGE.MEMBER.WELCOME_BACK") }}
                </p>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.member-page {
    min-height: 80vh;
    background: white;
}
</style>