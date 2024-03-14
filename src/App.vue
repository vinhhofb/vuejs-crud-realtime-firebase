<template>
<div class="content-box">
    <div class="form-box">
        <div class="container">
            <h2>Register Form</h2>
            <div>
                <div class="input-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" v-model="formData.username" required>
                </div>
                <div class="input-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" v-model="formData.email" required>
                </div>
                <div class="input-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" v-model="formData.password" required>
                </div>
                <button class="btn" @click="handleForm">{{ editingIndex != null ? "Edit" : "Add" }}</button>
            </div>
        </div>
    </div>
    <div class="table-box">
        <div class="table-container">
            <h2>List of Records</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(record, index) in records" :key="index">
                        <td>{{ record.username }}</td>
                        <td>{{ record.email }}</td>
                        <td>{{ record.password }}</td>
                        <td>
                            <button class="edit-button" @click="editRecord(index)">Edit</button>
                            <button class="delete-button" @click="deleteRecord(index)">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</template>

<script>
import {
    getDatabase,
    ref,
    push,
    onValue,
    remove,
    update
} from "firebase/database";
import firebaseApp from "@/firebase.js";

const db = getDatabase(firebaseApp);

export default {
    data() {
        return {
            editingIndex: null,
            formData: {
                username: '',
                email: '',
                password: ''
            },
            records: []
        };
    },
    created() {
        this.fetchRecords();

    },
    methods: {
        handleForm() {
            if (this.editingIndex != null) {
                this.updateRecord()
            } else {
                this.registerUser();
            }
        },
        editRecord(index) {
            this.editingIndex = index;
            this.formData = {
                ...this.records[index]
            };
        },
        updateRecord() {
            const userId = this.records[this.editingIndex].id;
            const newData = {
                username: this.formData.username,
                email: this.formData.email,
                password: this.formData.password
            };
            const db = getDatabase();
            update(ref(db, 'users/' + userId), newData)
                .then(() => {
                    this.formData = {
                        username: '',
                        email: '',
                        password: ''
                    };
                    this.editingIndex = null;

                })
                .catch(error => {
                    console.error('Error updating record: ', error);
                });
        },
        registerUser() {
            const db = getDatabase(firebaseApp);
            const collectionRef = ref(db, 'users');

            push(collectionRef, this.formData);
        },
        fetchRecords() {
            const collectionRef = ref(db, 'users');

            onValue(collectionRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    let dataArray = Object.keys(data).map(key => {
                        let obj = data[key];
                        obj.id = key;
                        return obj;
                    });
                    this.records = dataArray;
                } else {
                    this.records = [];
                }
            }, (error) => {
                console.error("Error fetching records:", error);
            });

        },
        deleteRecord(index) {
            const db = getDatabase(firebaseApp);
            const recordId = this.records[index].id;
            const recordRef = ref(db, `users/${recordId}`);
            remove(recordRef);
        }
    }
};
</script>

<style>
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 0;
}

.container {
    width: 400px;
    margin: 50px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

.input-group {
    margin-bottom: 20px;
}

.input-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.input-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
}

.btn {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
}

.btn:hover {
    background-color: #0056b3;
}

/* Container styling */
.table-container {
    margin: 20px auto;
    width: 80%;
}

/* Table styling */
.table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
}

/* Table header styling */
.table th {
    background-color: #007bff;
    color: white;
    padding: 10px;
    text-align: left;
}

/* Table body styling */
.table td {
    border-bottom: 1px solid #ddd;
    padding: 10px;
}

/* Alternate row background color */
.table tbody tr:nth-child(even) {
    background-color: #f2f2f2;
}

/* Hover effect on table rows */
.table tbody tr:hover {
    background-color: #ddd;
}

/* Delete button styling */
.delete-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.edit-button {
    margin-right: 5px;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
}

.form-box {
    width: 400px;
}

.content-box {
    width: 80%;
    margin: 50px auto;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
}

.table-box {
    width: calc(100% - 400px);
}
</style>
