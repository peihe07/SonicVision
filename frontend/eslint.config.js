import eslint from '@eslint/js';
import eslintConfigPrettier from '@vue/eslint-config-prettier';
import eslintConfigTypescript from '@vue/eslint-config-typescript';
import eslintPluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.vue'],
        plugins: {
            vue: eslintPluginVue,
        },
        rules: {
            'vue/multi-word-component-names': 'off',
            'vue/no-v-html': 'off',
            'vue/require-default-prop': 'off',
            'vue/max-attributes-per-line': ['error', {
                singleline: 3,
                multiline: 1
            }],
            'vue/html-self-closing': ['error', {
                html: {
                    void: 'always',
                    normal: 'always',
                    component: 'always'
                }
            }]
        }
    },
    eslintConfigPrettier,
    eslintConfigTypescript,
    {
        ignores: [
            'dist/**',
            'node_modules/**',
            'public/**'
        ]
    }
); 