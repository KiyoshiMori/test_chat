export default {
	Query: {
		async getMyInfo(_, input, { user }) {
			if (!user) return { authorized: false };
			return {
				...user,
				authorized: true
			};
		}
	}
}