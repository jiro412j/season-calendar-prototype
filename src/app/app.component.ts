import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import * as _ from 'lodash';
import * as moment from 'moment';
import { MatchData } from './mock.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showCalendar = false;
  dateList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  monthList = [];
  dayList = [];
  dayHeader = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  matchDayList = MatchData;
  tournamentList = [];
  season: any;
  seasonList = [];
  matchDay = {
    id: null,
    name: '',
    name_en: '',
    start_date: null,
    end_date: null,
    short_name: ''
  };
  isLoading = false;
  currentSeason: any;
  selectedTournament;
  colorList = [
    '#ef5777',
    '#575fcf',
    '#4bcffa',
    '#34e7e4',
    '#0be881',
    '#ffc048',
    '#ffdd59',
    '#ff5e57',
    '#d2dae2',
    '#485460',
    '#f53b57',
    '#3c40c6',
    '#0fbcf9',
    '#00d8d6',
    '#05c46b',
    '#ffa801',
    '#ffd32a',
    '#ff3f34',
    '#808e9b',
    '#1e272e',
    '#f3a683',
    '#f7d794',
    '#778beb',
    '#e77f67',
    '#cf6a87',
    '#786fa6',
    '#f8a5c2',
    '#63cdda',
    '#ea8685',
    '#596275',
    '#f19066',
    '#f5cd79',
    '#546de5',
    '#e15f41',
    '#c44569',
    '#574b90',
    '#f78fb3',
    '#3dc1d3',
    '#e66767',
    '#303952'
  ];
  checkTournament = [];
  stageList = [];
  stage: number;
  tournament: number;
  draggedMatchDay: any;
  oldParent: any;

  subs = new Subscription();
  isAdmin = false;

  constructor(private dragulaService: DragulaService) {
    this.subs.add(
      this.dragulaService.dropModel('VAMPIRES').subscribe(({ sourceModel, targetModel, item }) => {
        this.draggedMatchDay = item;
      })
    );
  }

  ngOnInit() {
    this.isAdmin = localStorage.is_competition_admin === 'true';
    let count = 0;
    _.times(38, () => {
      this.dayList.push(this.dayHeader[count]);
      count === 6 ? (count = 0) : count++;
    });
    this.dayList = ['hello', ...this.dayList];
    this.initiateDayInMonth();
  }

  initiateDayInMonth() {
    this.monthList = [
      { name: 'January', dateNum: [] },
      { name: 'February', dateNum: [] },
      { name: 'March', dateNum: [] },
      { name: 'April', dateNum: [] },
      { name: 'May', dateNum: [] },
      { name: 'June', dateNum: [] },
      { name: 'July', dateNum: [] },
      { name: 'August', dateNum: [] },
      { name: 'September', dateNum: [] },
      { name: 'October', dateNum: [] },
      { name: 'November', dateNum: [] },
      { name: 'December', dateNum: [] }
    ];
    const defaultData = { date: 'hello', match_day: [] };
    _.forEach(this.monthList, (month, monthIndex) => {
      const monthYear = 2019 + '-' + (monthIndex + 1);
      const num = moment(monthYear, 'YYYY-MM').daysInMonth();
      const startOfMonth = moment(monthYear)
        .locale('en-ca')
        .startOf('month')
        .format('dddd');
      let count = 0;
      _.times(num, () => {
        month.dateNum.push({ date: count + 1, match_day: [] });
        count++;
      });
      const dayIndex = _.findIndex(this.dateList, day => {
        return day.toLowerCase() === startOfMonth.toLowerCase();
      });
      _.times(dayIndex, () => {
        month.dateNum.unshift(defaultData);
      });
      _.times(38 - month.dateNum.length, () => {
        month.dateNum.push(defaultData);
      });
    });
    this.addMatchDayToCalendar();
  }

  addMatchDayToCalendar() {
    if (this.matchDayList.length) {
      _.forEach(this.matchDayList, matchDay => {
        const dateRange = moment(matchDay.end_date).diff(moment(matchDay.start_date), 'days');
        matchDay['date_range'] = dateRange;
        const monthIndex = _.findIndex(this.monthList, month => {
          return (
            month.name ===
            moment(matchDay.start_date)
              .locale('en')
              .format('MMMM')
          );
        });
        const dateIndex = _.findIndex(this.monthList[monthIndex].dateNum, date => {
          return date.date === Number(moment(matchDay.start_date).format('D'));
        });
        const matchDayColor = matchDay.color;
        matchDay['color'] = matchDayColor ? matchDayColor : '';
        this.monthList[monthIndex].dateNum[dateIndex].match_day.push(matchDay);
      });
    }
    this.showCalendar = true;
  }

  checkWeekend(dateIndex) {
    const weekend = [6, 7, 13, 14, 20, 21, 27, 28];
    return _.includes(weekend, dateIndex);
  }

  checkMiddleWeek(dateIndex) {
    const middleWeek = [3, 10, 17, 24, 31];
    return _.includes(middleWeek, dateIndex);
  }
}
