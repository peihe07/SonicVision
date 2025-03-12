<template>
    <div>
        <h1>註冊</h1>
        <form @submit.prevent="register">
            <input type="text" v-model="username" placeholder="帳號" required />
            <input type="email" v-model="email" placeholder="電子郵件" required />
            <input type="password" v-model="password" placeholder="密碼" required />
            <button type="submit">註冊</button>
        </form>
    </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const username = ref("");
        const email = ref("");
        const password = ref("");
        const router = useRouter();

        const register = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: username.value, email: email.value, password: password.value }),
                });

                if (!response.ok) throw new Error("註冊失敗");

                router.push("/login");
            } catch (error) {
                alert(error.message);
            }
        };

        return { username, email, password, register };
    },
};
</script>