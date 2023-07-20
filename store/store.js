import { createStore } from 'vuex' 
import calendarModule from '@/store/calendar.js'

const store = createStore({
	modules: {
		m_calendar: calendarModule
	}
}) 

export default store 