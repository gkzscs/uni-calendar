<template>
	<view class="shell">
		<!-- header -->  
		<view class="dates-header">
			<view class="last-year" @click="last_year_click_slot">{{'<<'}}</view> 
			<view class="last-month" @click="last_month_click_slot">{{'<'}}</view>
			<view class="cur-date">{{str_cur_date}}</view>
			<view class="next-month" @click="next_month_click_slot">&gt;</view>              
			<view class="next-year" @click="next_year_click_slot">&gt;&gt;</view> 
		</view>
		
		<!-- weekdays header -->   
		<view class="weekdays-header">
			<view v-for="(item, i) in arr_weekdays">{{item}}</view>
		</view>
		
		<!-- dates -->
		<view class="dates-box">
			<view class="last-month" v-for="(item, i) in dates.last_month_dates" @click="last_month_date_click_slot(item)">
				{{item}}
			</view>
			<view :class="{'selected': is_selected(i)}" v-for="(item, i) in dates.cur_month_dates" @click="cur_month_date_click_slot(item)">
				{{item}}
			</view>
			<view class="next-month" v-for="(item, i) in dates.next_month_dates" @click="next_month_date_click_slot(item)">
				{{item}}
			</view>
		</view>
	</view>
</template>
 
<script>
	import { mapState, mapMutations, mapGetters } from 'vuex' 
	
	export default {
		computed: {
			...mapState('m_calendar', ['cur_date', 'str_cur_date', 'cur_page_month']),
			
			is_selected() {
				return function(i) {
					const res = (this.dates.dates_info[i + this.dates.last_month_dates.length] == this.str_cur_date)
					return res 
				}
			},
		},
		
		data() {
			return {
				arr_weekdays: [],
				dates: {
					last_month_dates: [],
					cur_month_dates: [],
					next_month_dates: [],
					dates_info: []
				},
			};
		},
		
		onLoad() {
			this.init_members()
		},
		 
		methods: {
			...mapMutations('m_calendar', ['set_cur_date', 'set_date_param',
			 'clear_state', 'set_cur_page_month']),
			 
			...mapGetters('m_calendar', ['days_count_of_last_month', 
			'days_count_of_cur_month', 'days_count_of_next_month',
			'last_month_info', 'next_month_info', 'first_day_no', 
			'cur_date_str', 'last_year', 'next_year', 
			'last_month', 'next_month', 'date_str_by_param']),
			
			init_members() {
				this.init_weekdays_arr() 
				this.init_cur_date()
				
				this.update_data_by_cur_date()
			},
			
			init_weekdays_arr() {
				this.arr_weekdays = [
					'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
				]
			},
			
			init_cur_date() {
				// clear date
				this.clear_state()
				
				// set default date 
				const dtObj = new Date()
				const dt = {
					year: dtObj.getFullYear(),
					month: dtObj.getMonth(),
					day: dtObj.getDate()
				}
				this.set_cur_date(dt)
				
				this.set_cur_page_month(dt.month)
			},
			
			update_data_by_cur_date() {
				// clear old data 
				this.clear_data()
				
				// get info
				const dayCount = this.days_count_of_cur_month()
				const firstDayNo = this.first_day_no()
				const { month: lastMonth, year: yearOfLastMonth, days_count: dayCountOfLastMonth } = this.last_month_info()
				const { month: nextMonth, year: yearOfnextMonth, days_count: dayCountOfNextMonth } = this.next_month_info()
		
				for (let i = 1; i <= 42; ++i) {				
					let day, strDateInfo
					
					if (firstDayNo > 1 && firstDayNo > i) {
						// show dates in last month
						day = dayCountOfLastMonth - (firstDayNo - i) + 1
						this.dates.last_month_dates.push(day)
						
						const tmpDt = this.assemble_date_obj(yearOfLastMonth, lastMonth, day)
						strDateInfo = this.date_str(tmpDt)

					} else if (dayCount + firstDayNo <= i) {
						// show dates in next month
						day = i + 1 - (dayCount + firstDayNo)
						this.dates.next_month_dates.push(day)
						
						const tmpDt = this.assemble_date_obj(yearOfnextMonth, nextMonth, day)
						strDateInfo = this.date_str(tmpDt)
					} else {
						// show dates in current month
						day = i + 1 - firstDayNo
						this.dates.cur_month_dates.push(day)
						
						const tmpDt = this.assemble_date_obj(this.cur_date.year, this.cur_date.month, day)
						strDateInfo = this.date_str(tmpDt)
					}   
					
					this.dates.dates_info.push(strDateInfo)
				}
			},
			
			clear_data() {
				this.dates.last_month_dates = [],
				this.dates.cur_month_dates = [],
				this.dates.next_month_dates = [],
				this.dates.dates_info = []
			},
			
			set_cur_date_and_update(dt) {
				this.set_cur_date(dt)
				this.update_data_by_cur_date()
			},
			
			date_str(dt) {
				this.set_date_param(dt)
				const str = this.date_str_by_param()
				return str 
			},
			
			assemble_date_obj(y, m, d) {
				return {
					year: y,
					month: m, 
					day: d
				}
			},
			
			// slots
			last_year_click_slot() {
				const dt = this.last_year()
				dt.day = this.cur_date.day
				
				this.set_cur_date_and_update(dt)
			},
			
			last_month_click_slot() {
				const dt = this.last_month()
				dt.day = this.cur_date.day 
				this.set_cur_page_month(dt.month)
				this.set_cur_date_and_update(dt)
			},
			
			next_month_click_slot() {
				const dt = this.next_month()
				dt.day = this.cur_date.day
				
				this.set_cur_page_month(dt.month)
				this.set_cur_date_and_update(dt)
			},
			
			next_year_click_slot() {
				const dt = this.next_year()
				dt.day = this.cur_date.day
				
				this.set_cur_date_and_update(dt)
			},
			
			last_month_date_click_slot(e) {
				const dt = this.last_month_info()
				dt.day = e
				this.set_cur_date(dt)
			},
		
			// don't modify current page's main month
			cur_month_date_click_slot(e) {
				const dt = this.cur_date 
				dt.month = this.cur_page_month 
				dt.day = e 
				this.set_cur_date(dt)
			},
			
			next_month_date_click_slot(e) {
				const dt = this.next_month_info()
				dt.day = e
				this.set_cur_date(dt)
			},
		},
	}
</script>

<style lang="scss">
	$accent-color: #ff2189;
	
	root {
		margin: 0; 
		padding: 0; 
		box-sizing: border-box;
	}
	
	.shell {
		display: flex;
		flex-direction: column;
		// gap: 20rpx;
		width: calc(100vw - 20rpx * 2); 
		font-family: 'consolas';
		padding: 20rpx;
		user-select: none;
	}
	
	.dates-header {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		font-size: 1.3rem;
		background-color: #7fffd488;
		
		view {
			outline: none;
			border: 2px solid transparent;
			background-color: transparent;
			cursor: pointer;
			padding: 0 10px;
			transition: all .3s;
			font-size: 1.3rem;
		}
		
		.cur-date {
			font-size: 1.6rem; 
			font-weight: bold;
			color: $accent-color;
			width: 300rpx;
			text-align: center;
		}
	}
	
	.weekdays-header { 
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		font-size: 1.2rem; 
		color: $accent-color;
		font-weight: bold;
		background-color: #faebcd88;
	}
	
	.dates-box {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		width: 100%;
		background-color: #ff218911;

		view {
			background-color: orange;
			padding: 20rpx 0;
			text-align: center;
			transition: all .3s;
			border: 2px solid transparent;
			cursor: pointer;
			background-color: transparent;
			box-shadow: 1px 1px 1px #faebcd66;
			color: orange;
			font-size: 1.2rem;
			transition: all .3s; 
			
			// &:hover {
			// 	border-color: $accent-color;
			// }
			
			&.selected {
				background-color: $accent-color;
				color: white;
			}
			
			&.last-month, &.next-month {
				color: #ccc;
			}
		}
	}
	
</style>
