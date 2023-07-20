export default {
	namespaced: true, 
	
	state: {
		cur_date: {},
		str_cur_date: '',
		cur_page_month: 0,
		year_month_param: {},
		date_param: {},
	},
	
	mutations: {
		set_cur_date(state, date) {
			// check validation
			if (date.year < 1970) {
				date.year = 1970
			} else if (date.year > 3000) {
				date.year = 3000
			}
			
			if (date.month < 0) {
				date.month = 0
			} else if (date.month > 11) {
				date.month = 11
			}
			
			const daysCount = new Date(date.year, date.month+1, 0).getDate()
			if (date.day < 1) {
				date.day = 1
			} else if (date.day > daysCount) {
				date.day = daysCount
			}
			
			// set date 
			state.cur_date = date
			
			// reset `str_cur_date`
			let str = `${date.year}-${date.month+1}`
			if (date.day) {
				str += `-${date.day}`
			}
			
			state.str_cur_date = str 
		},
		
		set_cur_page_month(state, m) {
			state.cur_page_month = m 
		},
		
		set_date_param(state, dt) {
			state.date_param = dt 
		},
		
		clear_state(state) {
			this.commit('m_calendar/set_cur_date', {})
			state.year_month_param = {}
		},
		
	},
	
	getters: {
		// days count
		first_day_no(state) {
			let day = new Date(state.cur_date.year, state.cur_page_month, 1).getDay()
	
			// sunday is 0, use 7 for calculation
			return (day == 0 ? 7 : day) 
		},
		
		days_count_by_param(state) {
			return new Date(state.year_month_param.year, state.year_month_param.month+1, 0).getDate()
		},
		
		days_count_of_last_month(state, g) {
			state.year_month_param = g.last_month
			const count = g.days_count_by_param
			
			return count 
		},
		
		days_count_of_cur_month(state, g) {
			state.year_month_param = {
				year: state.cur_date.year,
				month: state.cur_page_month
			}
			const count = g.days_count_by_param
			
			return count 
		},
		
		days_count_of_next_month(state, g) {
			state.year_month_param = g.next_month
			const count = g.days_count_by_param 
			
			return count 
		},
		
		last_month_info(state, g) {
			state.year_month_param = g.last_month
			const count = g.days_count_by_param 
			
			return { 
				year: state.year_month_param.year, 
				month: state.year_month_param.month, 
				days_count: count 
			}
		},
		
		next_month_info(state, g) {
			state.year_month_param = g.next_month
			const count = g.days_count_by_param 
			
			return { 
				year: state.year_month_param.year, 
				month: state.year_month_param.month, 
				days_count: count 
			}		
		},
		
		last_year(state) {
			return {
				year: --state.cur_date.year,
				month: state.cur_page_month
			}
		},
		
		next_year(state) {
			return {
				year: ++state.cur_date.year,
				month: state.cur_page_month
			}
		},
		 
		last_month(state) {
			const dt = {
				year: state.cur_date.year,
				month: state.cur_page_month
			}
			
			--dt.month 
			if (dt.month < 0) {
				--dt.year 
			}
			dt.month = (dt.month + 12) % 12
			
			return dt 
		},
		
		next_month(state) {
			const dt = {
				year: state.cur_date.year,
				month: state.cur_page_month
			}
			
			++dt.month 
			if (dt.month > 11) {
				++dt.year 
			}
			dt.month = dt.month % 12
			return dt 
		},
		
		date_str_by_param(state) {
			let str = `${state.date_param.year}-${state.date_param.month+1}`
			if (state.date_param.day) {
				str += `-${state.date_param.day}`
			}

			return str 
		},
		
		cur_date_str(state, g) {
			state.date_param = state.cur_date
			
			return g.date_str_by_param
		},

	},
}