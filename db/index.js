// inside db/index.js
const { Client } = require('pg'); // imports the pg module
const { rows } = require('pg/lib/defaults');

// supply the db name and location of the database
const client = new Client('postgres://localhost:5432/juicebox-dev');

// module.exports = {
//     client,
// }


async function getAllUsers() {
    const { rows } = await client.query(
        `SELECT id, username, password, name, location, active 
      FROM users;
    `, []);
    console.log("komal", rows)
    return rows;
}


async function getAllPosts() {
    const { rows } = await client.query(
        `SELECT authorId, title, content, active 
      FROM posts;
    `, []);
    console.log("Allposts", rows)
    return rows;
}

// and export them


async function createUser({
    username,
    password,
    name,
    location
}) {
    try {
        const { rows: [user] } = await client.query(`
        INSERT INTO users(username, password, name, location)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (username) DO NOTHING
        RETURNING *;
      `, [username, password, name, location]);

        return user;
    } catch (error) {
        console.log("komal");
        throw error;
    }
}



async function updateUser(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    // return early if this is called without fields
    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [user] } = await client.query(`
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));

        return user;
    } catch (error) {
        throw error;
    }
}


async function updatePost(id, fields = {}) {
    // build the set string
    const setString = Object.keys(fields).map(
        (key, index) => `"${key}"=$${index + 1}`
    ).join(', ');

    // return early if this is called without fields
    if (setString.length === 0) {
        return;
    }

    try {
        const { rows: [post] } = await client.query(`
        UPDATE posts
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `, Object.values(fields));

        return post;
    } catch (error) {
        throw error;
    }
}


async function createPost({
    authorId,
    title,
    content
}) {
    try {
        const { rows: [post] } = await client.query(`
        INSERT INTO posts(authorId, title, content)
        VALUES ($1, $2, $3)
        RETURNING *;
      `, [authorId, title, content]);
        console.log("komzrows", post)
        return post;
    } catch (error) {
        console.log("komal");
        throw error;
    }
}


async function getPostsByUser(userId) {
    // console.log("userId", userId)
    try {
        const rows = await client.query(`
        SELECT * FROM posts
        WHERE authorid=${userId};
      `);
        console.log("rows137", rows.rows[0])
        return rows.rows[0]
    } catch (error) {
        // console.log("error", error);
        throw error;
    }
}


async function getUserById(userId) {
    // first get the user (NOTE: Remember the query returns 
    // (1) an object that contains 
    // (2) a `rows` array that (in this case) will contain 
    // (3) one object, which is our user.
    // if it doesn't exist (if there are no `rows` or `rows.length`), return null

    // if it does:
    // delete the 'password' key from the returned object
    // get their posts (use getPostsByUser)
    // then add the posts to the user object with key 'posts'
    // return the user object

    try {
        const rows = await client.query(`
        SELECT * FROM users
        WHERE id=${userId};
      `);

        if ((rows.rows).length > 0) {
            delete rows.rows[0].password;

            rows.rows[0].posts = await getPostsByUser(userId)
            // const posts = await getPostsByUser(userId)
            // console.log("posts30", posts)
            return rows.rows[0];
        }

        console.log("rows", rows)
        return rows;
    } catch (error) {
        // console.log("error", error);
        throw error;
    }
}

module.exports = {
    client,
    getAllUsers,
    createUser,
    updateUser,
    createPost,
    getAllPosts,
    updatePost,
    getPostsByUser,
    getUserById,
}

// just need to have one module.export with all functions/objects that we are exporting - Note from Travis