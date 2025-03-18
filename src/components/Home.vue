<template>
  <v-container>
    <v-btn @click="openCreateModal">Создать пользователя</v-btn>

    <!-- Таблица пользователей -->
    <v-data-table :headers="headers" :items="users" item-key="id">
      <template v-slot:item.actions="{ item }">
        <v-btn @click="openEditModal(item)">Редактировать</v-btn>
        <v-btn color="red" @click="deleteUser(item.id)">Удалить</v-btn>
      </template>
    </v-data-table>

    <!-- Модальное окно создания пользователя -->
    <v-dialog v-model="createModal" max-width="500px">
      <v-card>
        <v-card-title>Создать пользователя</v-card-title>
        <v-card-text>
          <v-form ref="createForm" v-model="valid" lazy-validation>
            <v-text-field v-model="form.username" label="Имя пользователя" required></v-text-field>
            <v-text-field v-model="form.email" label="Email" required></v-text-field>
            <v-text-field v-model="form.password" label="Пароль" type="password" required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="createModal = false">Отмена</v-btn>
          <v-btn color="primary" @click="createUser" :disabled="!valid">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Модальное окно редактирования пользователя -->
    <v-dialog v-model="editModal" max-width="500px">
      <v-card>
        <v-card-title>Редактировать пользователя</v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="valid" lazy-validation>
            <v-text-field v-model="editForm.username" label="Имя пользователя" required></v-text-field>
            <v-text-field v-model="editForm.email" label="Email" required></v-text-field>
            <v-text-field v-model="editForm.password" label="Пароль" type="password" required></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="editModal = false">Отмена</v-btn>
          <v-btn color="primary" @click="updateUser" :disabled="!valid">Обновить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'

const users = ref([])
const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Имя пользователя', value: 'username' },
  { text: 'Email', value: 'email' },
  { text: 'Действия', value: 'actions', sortable: false }
]

const createModal = ref(false)
const editModal = ref(false)

const form = ref({
  username: '',
  email: '',
  password: ''
})

const editForm = ref({
  id: null,
  username: '',
  email: '',
  password: ''
})

const valid = ref(false)

const fetchUsers = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/users')
    users.value = response.data
  } catch (error) {
    console.error(error)
  }
}

const openCreateModal = () => {
  form.value = { username: '', email: '', password: '' }
  createModal.value = true
}

const createUser = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/users', form.value)
    users.value.push(response.data)
    createModal.value = false
  } catch (error) {
    console.error(error)
  }
}

const openEditModal = (user) => {
  editForm.value = { ...user }
  editModal.value = true
}

const updateUser = async () => {
  try {
    const response = await axios.put(`http://localhost:3000/api/users/${editForm.value.id}`, editForm.value)
    const index = users.value.findIndex((user) => user.id === response.data.id)
    if (index !== -1) {
      users.value[index] = response.data
    }
    editModal.value = false
  } catch (error) {
    console.error(error)
  }
}

const deleteUser = async (id) => {
  try {
    await axios.delete(`http://localhost:3000/api/users/${id}`)
    users.value = users.value.filter((user) => user.id !== id)
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.v-btn {
  margin-right: 10px;
}
</style>
