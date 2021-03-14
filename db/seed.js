// db/seed.js

const {
    client,
    createUser,
    getAllUsers,
    updateUser,
    createPost,
    getAllPosts,
    updatePost,
    getPostsByUser,
    getUserById,
    addTagsToPost,
    createTags,
    getAllTags,
    getPostById,
    getPostsByTagName,
} = require('./index');

// const api = require('./index');


async function dropTables() {
    try {
        console.log("Starting to drop tables...");

        await client.query(`
        DROP TABLE IF EXISTS post_tags;
        DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS POSTS;
        DROP TABLE IF EXISTS users;
      `);

        console.log("Finished dropping tables!");
    } catch (error) {
        console.error("Error dropping tables!");
        throw error;
    }
}

async function createTables() {
    try {
        console.log("Starting to build tables...");

        await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255) NOT NULL,
          active BOOLEAN DEFAULT true
        );

        CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true
        );

        CREATE TABLE tags (
            id SERIAL PRIMARY KEY,
            name varchar(255) UNIQUE NOT NULL
          );
    
        CREATE TABLE post_tags (
            "postId" INTEGER REFERENCES posts(id),
            "tagId" INTEGER REFERENCES tags(id),
            UNIQUE ("postId", "tagId")
          );

      `);

        console.log("Finished building tables!");
    } catch (error) {
        console.error("Error building tables!");
        throw error;
    }
}

// async function createPostTable() {
//     try {
//         console.log("Starting to build posts tables...");

//         await client.query(`
//             CREATE TABLE posts (
//             id SERIAL PRIMARY KEY,
//             "authorId" INTEGER REFERENCES users(id) NOT NULL,
//             title VARCHAR(255) NOT NULL,
//             content TEXT NOT NULL,
//             active BOOLEAN DEFAULT true
//     );
//     `);
//         console.log("Finished building posts tables!");
//     } catch (error) {
//         console.error("Error building posts tables!");
//         throw error;
//     }
// }


// async function initializePost() {
//     try {
//         const createPost = await createPost({
//             authorId: "komz.patel",
//             title: "the girl",
//             content: "Blah Blah Blah"
//         });
//         console.log("Calling createPost", createPost)
//     }
//     catch (error) {
//         console.error("Error creating users!");
//         throw error;
//     }
// }


async function createInitialUsers() {
    try {
        console.log("Starting to create users...");

        const albert = await createUser({ username: 'albert', password: 'bertie99', name: 'Alert', location: 'Jax' });
        // const albertTwo = await createUser({ username: 'albert', password: 'imposter_albert' });
        const sandra = await createUser({ username: 'sandra', password: '2sandy4met', name: 'Sandra', location: 'Seattle' });
        const glamgal = await createUser({ username: 'glamgal', password: 'soglam', name: 'Glamgal', location: 'Atlanta' });

        console.log(albert);

        console.log("Finished creating users!");
    } catch (error) {
        console.error("Error creating users!");
        throw error;
    }
}


async function createInitialPosts() {
    try {
        console.log("Starting to create posts...");

        const albert = await createPost({ authorId: 1, title: "the girl", content: "Blah Blah Blah", tags: ["#happy", "#youcandoanything"] });
        const sandra = await createPost({ authorId: 2, title: "the boy", content: "Blah taah", tags: ["#happy", "#worst-day-ever"] });
        const glamgal = await createPost({ authorId: 3, title: "the null", content: "Blah daah", tags: ["#happy", "#youcandoanything", "#canmandoeverything"] });

        console.log(albert);

        console.log("Finished creating posts!");
    } catch (error) {
        console.error("Error creating posts!");
        throw error;
    }
}

async function createInitialTags() {
    try {
        console.log("Starting to create tags...");

        const [happy, sad, inspo, catman] = await createTags([
            '#happy',
            '#worst-day-ever',
            '#youcandoanything',
            '#catmandoeverything'
        ]);

        const [postOne, postTwo, postThree] = await getAllPosts();

        /* await addTagsToPost(postOne.id, [happy, inspo]);
        await addTagsToPost(postTwo.id, [sad, inspo]);
        await addTagsToPost(postThree.id, [happy, catman, inspo]); */

        console.log("Finished creating tags!");
    } catch (error) {
        console.log("Error creating tags!");
        throw error;
    }
}
// async function createInitialPosts() {
//     try {
//         const [albert, sandra, glamgal] = await getAllUsers();

//         await createPost({
//             authorId: albert.id,
//             title: "First Post",
//             content: "This is my first post. I hope I love writing blogs as much as I love writing them."
//         });

//         // a couple more
//     } catch (error) {
//         throw error;
//     }
// }

async function rebuildDB() {
    try {
        client.connect();

        await dropTables();
        await createTables();
        await createInitialUsers();
        // await createPostTable();
        await createInitialPosts();
        await createInitialTags();
        // await getAllTags();

    } catch (error) {
        throw error;
    }
}

async function testDB() {
    try {
        console.log("Starting to test database...");

        console.log("Calling getAllUsers")
        const users = await getAllUsers();
        console.log("ResultUsers:", users);

        const posts = await getAllPosts();
        console.log("ResultPost:", posts);

        console.log("Calling updateUser on users[0]")
        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("ResultUpdateUserResults:", updateUserResult);

        const updateUserPost = await updatePost(posts[0].id, {
            title: "tadadadada",
            content: "terrrrrrrrrr"
        });
        console.log("ResultUpdateUserPost:", updateUserPost);

        const postOfUser = await getPostsByUser(1);
        console.log("ResultPostOfUser:", postOfUser);


        const userById = await getUserById(1);
        console.log("ResultUSerById:", userById)

        console.log("Calling getAllTags");
        const allTags = await getAllTags();
        console.log("ResultGetTags:", allTags);


        // const postsWithHappy = await getPostsByTagName("#happy");
        // console.log("ResultPostsbyTagName:", postsWithHappy);
        // const tagsToPost = await addTagsToPost(1, allTags);
        // console.log("tagsToPost:", tagsToPost);


        const getPostByIDs = await getPostById(2);
        console.log("getPosById:", getPostByIDs);


        console.log("Calling updatePost on posts[1], only updating tags");
        const updatePostTagsResult = await updatePost(posts[0].id, {
            tags: ["#youcandoanything", "#redfish", "#bluefish"]
        });
        console.log("ResultpostbyID:", updatePostTagsResult);


        console.log("Calling getPostsByTagName with #happy");
        const postsWithHappy = await getPostsByTagName("#happy");
        console.log("Resultlastfunc:", postsWithHappy);


        console.log("Finished database tests!");
    } catch (error) {
        console.error("Error testing database!");
        throw error;
    }
}


rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());