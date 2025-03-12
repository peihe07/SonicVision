<template>
    <div>
        <h1>登入</h1>
        <form @submit.prevent="login">
            <input type="text" v-model="username" placeholder="帳號" required />
            <input type="password" v-model="password" placeholder="密碼" required />
            <button type="submit">登入</button>
        </form>
    </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const username = ref("");
        const password = ref("");
        const router = useRouter();

        const login = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/users/token/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: username.value, password: password.value }),
                });

                if (!response.ok) throw new Error("登入失敗");

                const data = await response.json();
                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);
                router.push("/");
            } catch (error) {
                alert(error.message);
            }
        };

        return { username, password, login };
    },
};
</script>