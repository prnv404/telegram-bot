import 'dotenv/config'
import { ChatGPTAPI } from 'chatgpt'
import TelegramBot from 'node-telegram-bot-api'

const api = new ChatGPTAPI({
	apiKey: process.env.OPENAI_API_KEY,
	completionParams: {
		max_tokens: 1000,
	},
})

const bot = new TelegramBot(process.env.BOT_KEY, { polling: true })

let res = {}
res.conversationId = null
bot.on('message', async (msg) => {
		const message = msg.text
		console.log(message)
	const replyId = msg.message_id
	console.log(replyId)
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
			console.log(res)
			bot.sendMessage(msg.chat.id, res.text, { reply_to_message_id: replyId })
		}
	}
	
})

bot.on('new_chat_members', async (msg) => {
	const chatId = msg.chat.id
	const res = await api.sendMessage(
		'A welcome message for a person who join  group for learning programming and tell them to ask question weather is bullshit or not its dosent matter'
	)
	const newMember = msg.new_chat_members[0]
	console.log(newMember)
	if (newMember.first_name !== 'debugGPT') {
		bot.sendMessage(chatId, ` ${newMember.first_name}!  ${res.text}`)
	}
})
