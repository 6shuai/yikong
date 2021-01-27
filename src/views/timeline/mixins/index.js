export const timelineFunc = {
    methods: {
        //更新 查找资源的开始时间
        updateStartTime(time, duration) {
            if(!time) return
            let t = time.split(":");
            //小时
            let h = Number(t[0]);
            //分钟
            let m = Number(t[1]);
            //秒
            let s = Number(t[2]);

            //秒转换成分钟  余出来的秒数
            let remainderS = duration % 60;


            //秒数转为 分钟
            let d = (duration - remainderS) / 60;



            if (d > 60) {
                h = h + (d - d % 60) / 60;
                d = d % 60;
            } else if (d < -60) {
                h = h - Math.abs(d - d % 60) / 60;
                d = d % 60;
            }

            if (s + remainderS >= 60) {
                s = s + remainderS - 60;
                m = m + 1;
            } else if (s + remainderS < 0) {
                s = 60 - Math.abs(s + remainderS);
                m = m - 1;
            } else {
                s = s + remainderS;
            }
            if (m + d >= 60) {
                m = m + d - 60;
                h = h + 1;
            } else if (m + d < 0) {
                m = 60 - Math.abs(m + d);
                h = h - 1;
            } else {
                m = m + d;
            }
            return (
                this.addPreZero(h) +
                ":" +
                this.addPreZero(m) +
                ":" +
                this.addPreZero(s)
            );
        },

        //计算时间差（相差分钟）
        // var beginTime="08:31:00";
        // var endTime="21:50:00";
        timeDifference(beginTime, endTime) {
            if (!beginTime) return;
            var start1 = beginTime.split(":");
            var startAll = parseInt(start1[0] * 60) + parseInt(start1[1]);
            if (!endTime) {
                return startAll * 60 + parseInt(start1[2]);
            }

            var end1 = endTime.split(":");
            var endAll = parseInt(end1[0] * 60) + parseInt(end1[1]);
            let minute = endAll - startAll;

            return minute * 60 - (parseInt(start1[2]) - parseInt(end1[2]));
        },

        //小于10 前面补个0
        addPreZero(number) {
            number = number < 0 ? (number = 0) : number;
            return number < 10 ? "0" + number : number;
        },

        //时间轴资源 自动寻位
        timelineForeachFind(resolve, Pindex, stageStarTime) {
            let obj = this.rectangleData[Pindex];
            let isOverlap = false;
            let objLength = obj.length;

            if (!obj.length) {
                resolve(obj);
                return;
            }

            for (let key in obj) {
                let item = obj[key];
                let index = Number(key);

                //当前资源的开始时间
                let currentStartTime = item.beginTime;

                //当前资源的结束时间
                let currentEndTime = item.endTime;

                //下一个资源
                let nextData = obj[index + 1];

                //下一个资源的开始时间
                let nextStarTime =
                    index === obj.length - 1 ? " " : nextData.beginTime;

                //上一个资源
                let prevData = obj[index - 1];

                //上一个资源的开始时间
                let prevStartTime =
                    index == 0 ? stageStarTime : prevData.beginTime;

                //上一个资源的结束时间
                let prevEndTime =
                    index == 0 ?
                    stageStarTime :
                    this.findEndTime(
                        prevData.beginTime,
                        prevData.duration
                    );

                //相差时间 秒
                let diffNum = 0;

                //当前资源 开始时间 和 上一个资源时间重叠
                if (
                    this.timeDifference(prevEndTime, currentStartTime) < 0
                ) {
                    diffNum = this.timeDifference(
                        currentStartTime,
                        prevEndTime
                    );
                    // console.log("重叠---------,", diffNum, currentStartTime, prevEndTime);
                }

                //当前资源 开始时间 未紧跟上一个结束时间
                if (
                    this.timeDifference(prevEndTime, currentStartTime) > 0
                ) {
                    diffNum = this.timeDifference(
                        currentStartTime,
                        prevEndTime
                    );
                }

                //游戏资源
                // if (item.contentTypeId == this.contentTypeId.game) {
                //     //游戏资源的开始时间 和 上一个资源重叠
                //     if (diffNum > 0) {
                //         //把上一个资源的 结束时间改成 到当前游戏的开始时间
                //         obj[index - 1] = {
                //             ...prevData,
                //             endTime: currentStartTime,
                //             contentDuration: prevData.duration - diffNum,
                //             duration: prevData.duration - diffNum,
                //         };

                //         //把上一个资源剩余的 时间 放到游戏的后面
                //         let obj1 = obj;
                //         let j = index + 1;
                //         for (let i = 0; i < obj1.length; i++) {
                //             if (
                //                 i > index &&
                //                 obj1[i].contentId == this.contentTypeId.game
                //             ) {
                //                 j += 1;
                //             } else {
                //                 break;
                //             }
                //         }

                //         obj.splice(j, 0, {
                //             ...prevData,
                //             beginTime: currentEndTime,
                //             endTime: this.findEndTime(
                //                 currentEndTime,
                //                 diffNum
                //             ),
                //             id: prevData.duration - diffNum <= 0 ? prevData.id : null,
                //             duration: obj[index - 1].duration <= 0 ? obj[index - 1].duration + diffNum : diffNum,
                //             contentDuration: obj[index - 1].duration <= 0 ? obj[index - 1].duration + diffNum : diffNum,
                //         });

                //         if (prevData.duration - diffNum <= 0)
                //             obj.splice(index - 1, 1);

                //         try {
                //             if (this.timeDifference(currentStartTime, obj[index - 2].endTime) > 0) {
                //                 isOverlap = true;
                //             }
                //         } catch (e) {

                //         }
                //     }

                //     if (diffNum < 0 && index != obj.length - 1) {
                //         //把下一个资源挪到 游戏资源的前面
                //         let obj1 = obj;
                //         let j = index;
                //         for (let i = 0; i < obj1.length; i++) {
                //             if (
                //                 obj1[index + i] &&
                //                 obj1[index + i].contentTypeId ==
                //                 this.contentTypeId.game
                //             ) {
                //                 j += 1;
                //             } else {
                //                 break;
                //             }
                //         }

                //         if (!obj[j]) return;

                //         let count = this.timeDifference(
                //             prevEndTime,
                //             currentStartTime
                //         );

                //         //时间段  小于 这个资源的秒数   修改这个资源的结束时间  和 秒数
                //         if (count <= obj[j].duration) {
                //             obj[j] = {
                //                 ...obj[j],
                //                 endTime: this.findEndTime(
                //                     obj[j].beginTime,
                //                     obj[j].duration - count
                //                 ),
                //                 duration: obj[j].duration - count,
                //                 contentDuration: obj[j].duration - count,
                //             };
                //         }

                //         //单独创建一个资源  插入到游戏资源前面
                //         console.log(obj[j], obj[j].duration)
                //         obj.splice(index, 0, {
                //             ...obj[j],
                //             beginTime: this.findEndTime(
                //                 currentStartTime,
                //                 -count
                //             ),
                //             endTime: currentStartTime,
                //             id: obj[j].duration ? null : obj[j].id,
                //             duration: count,
                //             contentDuration: count,
                //         });
                //         console.log(obj[j + 1], obj[j + 1].duration)
                //         if (!obj[j + 1].duration) {
                //             this.$delete(obj, j + 1);
                //         }
                //     }
                // } else {
                    obj[index] = {
                        ...item,
                        beginTime: this.updateStartTime(
                            currentStartTime,
                            diffNum
                        ),
                        endTime: this.updateStartTime(
                            currentEndTime,
                            diffNum
                        ),
                    };
                }
            // }

            obj.sort((a, b) => {
                return (
                    this.timeDifference(a.beginTime) -
                    this.timeDifference(b.beginTime)
                );
            });
            if (isOverlap || objLength < obj.length) {
                this.timelineForeachFind(resolve, Pindex);
                return
            }
            resolve(obj);
        },


        //传入时间  和秒数    返回一个新的时间
        findEndTime(time, duration) {
            let t = time.split(":");
            //小时
            let h = Number(t[0]);
            //分钟
            let m = Number(t[1]);
            //秒
            let s = Number(t[2]) || 0;

            //秒转换成分钟  余出来的秒数
            let remainderS = duration % 60;

            //秒数转为 分钟
            let d = (duration - remainderS) / 60;

            if (d > 60) {
                h = h + (d - d % 60) / 60;
                d = d % 60;
            }

            if (s + remainderS >= 60) {
                s = s + remainderS - 60;
                m = m + 1;
            } else {
                s = s + remainderS;
            }
            if (m + d >= 60) {
                m = m + d - 60;
                h = h + 1;
            } else {
                m = m + d;
            }
            return (
                this.addPreZero(h) +
                ":" +
                this.addPreZero(m) +
                ":" +
                this.addPreZero(s)
            );
        },
    }
}