console.log('Hello World!');




const firebaseConfig = {
    apiKey: "Your firebase api key",
    authDomain: "your firebase authdomain",
    databaseURL: "your firebase databaseurl",
    projectId: "your firebase project id",
    storageBucket: "your firebase storage",
    messagingSenderId: "your firebase project message id",
    appId: "your firebase app id",
    measurementId: "your firebase measurementId:"
};
// Initialize Firebase with your configuration

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Get references to HTML elements
let login = document.getElementById('signup');
let logout = document.getElementById('signout');

// Add event listeners for login and logout buttons
login.addEventListener('click', login_singup);



logout.addEventListener('click', logout_singout);

// Call the check function to determine if the user is already signed in.
check();

// Function to check if a user is signed in
function check() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            console.log('User is signed in');
            login.style.display = 'none';
            logout.style.display = 'block';
            document.getElementById('get_items').style.display = 'block';
            document.getElementById('addItems').style.display = 'block';
            document.getElementById('display').style.display = 'block'
            display(); // Call display function for signed-in user
        } else {
            // No user is signed in.
            console.log('No user is signed in');
            login.style.display = 'block';
            logout.style.display = 'none';
            document.getElementById('get_items').style.display = 'none';
            document.getElementById('addItems').style.display = 'none';
            document.getElementById('display').style.display = 'none'
        }
    });
}

// Function to handle login/sign-up
function login_singup() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then((result) => {
            let user = result.user;
            console.log('User signed in:', user.displayName);
            //alert(user.displayName);
        })
        .catch(error => {
            console.log(error.message);
            //alert(error.message);
        });
}

// Function to handle logout
function logout_singout() {
    //alert('button')
    firebase.auth().signOut()
        .then(() => {
            console.log('User signed out');
            //alert('user singed out')
        })
        .catch(error => {
            console.log(error.message);
            //alert(error.message)
        });
}

// Function to send data to the database
function sendTodb() {
    let input_items = document.getElementById('get_items').value;
    const user = firebase.auth().currentUser;

    if (user) {
        const userId = user.uid;
        const items = db.ref(`/users/${userId}`);

        items.push({
            items: input_items
        });
        document.getElementById('get_items').value = '';
        //alert('items added')
    } else {
        console.log('User not signed in');
        //alert('User not signed in')
    }
}
/*
// Function to display data from the database
function display() {
    const user = firebase.auth().currentUser;

    if (user) {
        const userId = user.uid;
        const items = db.ref(`/users/${userId}`);
        let ul = document.getElementById('myList'); // Get the ul element by its id

        items.on('child_added', function (snapshot) {
            const grab_Items_From_db = snapshot.val().items;
            console.log(grab_Items_From_db);
            let li = document.createElement('li');
            li.textContent = grab_Items_From_db;
            ul.appendChild(li); // Append the new li element to the ul
        });
    } else {
        console.log('User not signed in');
    }
}
*/
// ... (your existing code)

// Function to display data from the database
function display() {
    const user = firebase.auth().currentUser;

    if (user) {
        const userId = user.uid;
        const itemsRef = db.ref(`/users/${userId}`);
        let ul = document.getElementById('myList');

        itemsRef.on('child_added', function (snapshot) {
            const key = snapshot.key;
            const grab_Items_From_db = snapshot.val().items;

            let li = document.createElement('li');
            li.textContent = grab_Items_From_db;

            // Create a delete icon element
            let deleteIcon = document.createElement('span');
            deleteIcon.textContent = '🗑' ;
            deleteIcon.className = 'delete-icon';
            deleteIcon.style.display = 'none'; // Initially hide the delete icon

            // Toggle the visibility of delete icon on li click
            li.addEventListener('click', function () {
                deleteIcon.style.display = deleteIcon.style.display === 'none' ? 'inline-block' : 'none';
            });

            // Add a click event listener to the delete icon
            deleteIcon.addEventListener('click', function (event) {
                event.stopPropagation(); // Prevent li click event from firing

                // Remove the item from the database
                itemsRef.child(key).remove()
                    .then(() => {
                        console.log('Item removed from the database');
                    })
                    .catch(error => {
                        console.error('Error removing item from the database:', error);
                    });

                // Remove the item from the DOM
                ul.removeChild(li);
            });

            // Append the delete icon to the list item
            li.appendChild(deleteIcon);

            ul.appendChild(li);
        });
    } else {
        console.log('User not signed in');
    }
}

// ... (your existing code)

// Add an event listener to the "Add Items" button
document.getElementById('addItems').addEventListener('click', sendTodb);
