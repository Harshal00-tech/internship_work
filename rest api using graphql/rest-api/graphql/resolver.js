import Login from "../models/login.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import Post from "../models/post.model.js";

const resolvers = {
	Query: {
		getPost: async function (_, { userInput }, { user }) {
			const postId = userInput.postId;
			if (!postId) {
				throw new Error("id not found.");
			}
			const post = await Post.findById(postId);
			post.creator = user;
			return post;
		},
		getPosts: async function (_, { userInput }, { user }) {
			const { page, limit } = userInput;
			const posts = await Post.find({ creator: user._id })
				.skip((page - 1) * limit)
				.limit(limit);
			for (let post of posts) {
				post.creator = user;
			}
			return posts;
		},
	},

	Mutation: {
		registerUser: async function (_, { userInput }) {
			try {
				const name = userInput.name;
				const email = userInput.email;
				const password = userInput.password;
				console.log(name, email, password);
				const existedUser = await User.findOne({ email });
				if (existedUser) {
					throw new Error("user already exist.");
				}
				const hashedPass = bcrypt.hashSync(password, 12);
				if (!hashedPass) {
					throw new Error("error while encrypting password.");
				}
				const user = await User.create({
					name,
					email,
					password: hashedPass,
				});
				if (!user) {
					throw new Error("server error while creating user.");
				}
				return { ...user._doc, _id: user._id.toString() };
			} catch (error) {
				throw new Error("server error", error);
			}
		},
		loginUser: async function (_, { userInput }) {
			try {
				const email = userInput.email;
				const password = userInput.password;
				const user = await User.findOne({ email });
				if (!user) {
					throw new Error("User not Found.");
				}
				const checkedPass = await bcrypt.compare(
					password,
					user.password
				);
				if (!checkedPass) {
					throw new Error("invalid password");
				}
				const token = await user.createToken();
				const loginDetail = await Login.findOne({ userId: user._id });
				console.log(loginDetail);
				if (!loginDetail) {
					const login = await Login.create({
						userId: user._id,
						token: token,
						loginAt: [Date.now()],
						expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
					});
				} else {
					await loginDetail.updateLogin(token);
				}
				return { message: "user login successfully", token };
			} catch (error) {
				console.log(error);
				throw new Error(error.message);
			}
		},
		createPost: async function (_, { userInput }, { user }) {
			const { title, content } = userInput;
			if (!title || !content) {
				throw new Error("post data not found.");
			}
			const post = await Post.create({
				title,
				content,
				creator: user._id,
			});
			user.posts.push(post._id);
			await user.save();
			post.creator = user;
			return post;
		},
		updatePost: async function (_, { userInput }, { user }) {
			const { title, content, postId } = userInput;
			if (!title || !content) {
				throw new Error("post data not found.");
			}
			const post = await Post.findByIdAndUpdate(
				postId,
				{
					title,
					content,
				},
				{ new: true }
			);
			if (!post) {
				throw new Error("server error while updating post.");
			}
			post.creator = user;
			return post;
		},
		deletePost: async function (_, { postId }, { user }) {
			const post = await Post.findOneAndDelete({
				_id: postId,
				creator: user._id,
			});
			if (!post) {
				throw new Error("server error while deleting post.");
			}
			post.creator = user;
			console.log(post);
			const posts = user.posts.filter((postId) => {
				return postId != post._id;
			});
			user.posts = posts;
			user.save();

			return post;
		},
		logOut: async function (_, {}, { user }) {
			const loginDetail = await Login.findOne({ userId: user._id });
			loginDetail.isDeleted = true;
			loginDetail.expireAt = Date.now();
			console.log(loginDetail);
			const checkLogin = await loginDetail.save();
			if (!checkLogin) {
				throw new Error("error while logging out.");
			}
			return { message: "user logout successfully" };
		},
	},
};

export default resolvers;
