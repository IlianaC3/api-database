class Contenedor {
	constructor(conection) {
		this.con = conection;
	}

	async save(chat) {
		return this.con('chat_msg')
			.insert(chat)
			.then((id) => {
				return id;
			})
			.catch((err) => {
				return 0;
			});
	}

	async getAll() {
		return this.con('chat_msg')
			.select({
				id: 'id',
				email: 'email',
				message: 'message',
				date: 'date'
			})
			.then((chats) => {
				return chats;
			})
			.catch((err) => {
				return [];
			});
	}
}

module.exports = Contenedor;
