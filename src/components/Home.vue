<template>
  <v-container>
    <v-btn @click="openCreateModal">Создать пользователя</v-btn>

    <!-- Таблица пользователей -->
    <v-data-table :headers="headers" :items="users" item-key="_id">
      <template v-slot:item="{ item: User }">
        <tr>
          <td>{{ User._id }}</td>
          <td>{{ User.username }}</td>
          <td>{{ User.email }}</td>
          <td>
            <v-btn color="red" @click="deleteUser(User._id)">Удалить</v-btn>
          </td>
        </tr>
      </template>
    </v-data-table>

    <!-- Модальное окно создания пользователя -->
    <v-dialog v-model="createModal" max-width="500px">
      <v-card>
        <v-card-title>Создать пользователя</v-card-title>
        <v-card-text>
          <v-form ref="createForm" v-model="valid" lazy-validation>
            <v-text-field 
              v-model="form.username"
              label="Имя пользователя" 
              required
            ></v-text-field>
            <v-text-field 
              v-model="form.email"
              label="Email" 
              required
            ></v-text-field>
            <v-text-field 
              v-model="form.password"
              label="Пароль" 
              type="password" 
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="createModal = false">Отмена</v-btn>
          <v-btn color="primary" @click="createUser" :disabled="!valid">Создать</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, nextTick} from 'vue'
import axios from 'axios'

interface User {
  _id: string
  username: string
  email: string
  password?: string
}

interface EditForm extends User {
  id: string | null
}

const users = ref<User[]>([])
const headers = [
  { text: 'ID', value: '_id' },
  { text: 'Имя пользователя', value: 'username' },
  { text: 'Email', value: 'email' },
  { text: 'Действия', value: 'actions', sortable: false }
]

const createModal = ref(false)
const editModal = ref(false)

const form = ref<Omit<User, '_id'>>({
  username: '',
  email: '',
  password: ''
})

const editForm = ref<EditForm>({
  id: null,
  _id: '',
  username: '',
  email: '',
  password: ''
})

const valid = ref(false)

let socket: WebSocket | null = null

const fetchUsers = async () => {
  try {
    const response = await axios.get<User[]>('/api/users')
    users.value = response.data
  } catch (error) {
    console.error('Ошибка при загрузке пользователей:', error)
  }
}

const openCreateModal = () => {
  form.value = { username: '', email: '', password: '' }
  createModal.value = true
}

const createUser = async () => {
  try {
    const response = await axios.post<User>('/api/users', form.value)
    users.value.push(response.data)
    createModal.value = false
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error)
  }
}

watch(editForm, (newVal) => {
  console.log('editForm обновился:', newVal)
}, { deep: true })

const openEditModal = async (user: User) => {
  editModal.value = true
  await nextTick()
  editForm.value.id = user._id
  editForm.value.username = user.username
  editForm.value.email = user.email
  editForm.value.password = ''
}

const updateUser = async () => {
  try {
    const { id, ...data } = editForm.value
    const response = await axios.put<User>(`/api/users/${id}`, data)

    const index = users.value.findIndex(user => user._id === id)
    if (index !== -1) {
      users.value[index] = { ...users.value[index], ...response.data }
    }
    editModal.value = false
  } catch (error) {
    console.error(error)
  }
}

const deleteUser = async (id: string) => {
  try {
    await axios.delete(`/api/users/${id}`)
    users.value = users.value.filter((user) => user._id !== id)
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error)
  }
}

const setupWebSocket = () => {
  socket = new WebSocket('ws://localhost:4000')

  socket.onopen = () => {
    console.log('WebSocket connected')
  }

  socket.onmessage = async () => {
    await fetchUsers()
  }

  socket.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  socket.onclose = () => {
    console.log('WebSocket disconnected')
  }
}

onMounted(() => {
  fetchUsers()
  setupWebSocket()
})
</script>

<style scoped>
.v-btn {
  margin-right: 10px;
}
</style>
