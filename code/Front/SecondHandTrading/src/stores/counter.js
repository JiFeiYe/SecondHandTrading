import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useCounterStore = defineStore('counter', () => {

    // 'qazjfy'
    const token = ref('')

    // const count = ref(0)
    // const doubleCount = computed(() => count.value * 2)
    //
    // function increment() {
    //     count.value++
    // }

    return {token}
}, {
    persist: true,
})
