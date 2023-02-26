import 'dotenv/config'
import { ChatGPTAPI } from 'chatgpt'
import TelegramBot from 'node-telegram-bot-api'

const api = new ChatGPTAPI({
	apiKey: process.env.OPENAI_API_KEY,
	completionParams: {
		temperature: 0.5,
		max_tokens: 1000,
		top_p: 0.8,
	},
})

const bot = new TelegramBot(process.env.BOT_KEY, { polling: true })

let res = {}
res.conversationId = null
bot.on('message', async (msg) => {
    const message = msg.text
	if (message !== undefined) {
		if (message.startsWith('.gpt')) {
			if (!res.conversationId) {
				res = await api.sendMessage(message)
			} else {
				res = await api.sendMessage(message, {
					conversationId: res.conversationId,
					parentMessageId: res.id,
				})
			}
            bot.sendMessage(msg.chat.id, res.text)
            
		}
	}
})

bot.on('new_chat_members', async (msg) => {
	const chatId = msg.chat.id
	const newMembers = msg.new_chat_members
	const res = await api.sendMessage(
		'A welcome message for a person who join debugmedia group for learning programming'
	)
	newMembers.forEach((newMember) => {
		const firstName = newMember.first_name
		const lastName = newMember.last_name ? ' ' + newMember.last_name : ''
		const userName = newMember.username ? ' (@' + newMember.username + ')' : ''
		const welcomeMsg = firstName + lastName + ' ' + userName + res.text
		bot.sendMessage(chatId, welcomeMsg)
	})
})
