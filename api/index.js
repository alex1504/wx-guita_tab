import Bmob from '../utils/bmob';
import Util from '../utils/util.js'

module.exports = {
    getChords(page, limit, orderBy) {
        page = typeof page == 'undefine' ? 1 : page;
        page = parseInt(page);
        return new Promise((resolve, reject) => {
            let Guita_info = Bmob.Object.extend("guita_chord_info");
            let query = new Bmob.Query(Guita_info);
            limit = typeof limit == 'undefined' ? 10 : parseInt(limit);
            query.limit(limit);
            query.skip((page - 1) * limit);
            if (orderBy && orderBy == 'view_count') {
                query.descending('view_count');
            }
            if (orderBy && orderBy == 'createdAt') {
                query.descending('createdAt');
            }
            if (orderBy && orderBy == 'searchCount') {
                query.descending('search_count');
            }
            query.find({
                success: function (result) {
                    result = result.map(obj => {
                        return {
                            id: obj.id,
                            ...obj.attributes
                        }
                    });
                    resolve(result)
                },
                error: function (result, error) {
                    console.log(error)
                    resolve(error)
                }
            });
        })
    },
    getChordById(id) {
        return new Promise((resolve, reject) => {
            const Guita_info = Bmob.Object.extend("guita_chord_info");
            const query = new Bmob.Query(Guita_info);
            query.get(id, {
                success: function (result) {
                    resolve({
                        id: id,
                        ...result.attributes
                    })
                },
                error: function (result, error) {
                    resolve(error)
                }
            });
        })
    },
    // 从bmob查谱子
    searchChord(queryString) {
        const _this = this;
        return new Promise((resolve, reject) => {
            const Guita_info = Bmob.Object.extend("guita_chord_info");
            const songQuery = new Bmob.Query(Guita_info);
            //songQuery.contains("song_name", queryString);
            songQuery.equalTo("song_name", queryString);

            const authorQuery = new Bmob.Query(Guita_info);
            //authorQuery.contains("author_name", queryString);
            authorQuery.equalTo("author_name", queryString);

            const queryStringQuery = new Bmob.Query(Guita_info);
            queryStringQuery.equalTo("query", queryString);

            const mainQuery = Bmob.Query.or(songQuery, authorQuery, queryStringQuery);
            mainQuery.find({
                success: function (result) {
                    console.log(result)
                    result = result.map(obj => {
                        // 增加搜索统计
                        let num = obj.attributes.search_count;
                        num = typeof num === 'undefined' ? 0 : parseInt(num)+1;
                        obj.set('search_count', num);
                        obj.save();

                        return {
                            id: obj.id,
                            ...obj.attributes
                        }
                    });
                    resolve(result)
                    // if (result.length) {
                    //   result = result.map(obj => {
                    //     return {
                    //       id: obj.id,
                    //       ...obj.attributes
                    //     }
                    //   });
                    //   resolve(result)
                    // } else {
                    //   // 若数据库不存在，则爬取
                    //   _this.scratchChords(queryString)
                    //     .then(result => {
                    //       resolve(result)
                    //     }).catch(err=>{
                    //       console.log(err)
                    //     })
                    // }
                },
                error: function (result, error) {
                    resolve(error)
                }
            });
        })
    },
    // 从吉他谱网抓取谱子
    scratchChords(queryString) {
        const _this = this
        return new Promise((resolve, reject) => {
            wx.request({
                url: `https://guita.huzerui.com:8002/search?s=${queryString}`,
                success(res) {
                    const arr = res.data;
                    if (!arr.length) {
                        resolve([]);
                        return;
                    }
                    _this.addChords(arr, queryString)
                        .then(res => {
                            resolve(res)
                        }).catch(err => {
                        reject(err)
                    })
                },
                fail() {
                    reject()
                }
            })
        })
    },
    // 添加谱子到bmob
    addChords(chordArr, queryString) {
        const promises = chordArr.map(obj => {
            return new Promise((resolve, reject) => {
                var Chord = Bmob.Object.extend("guita_chord_info");
                var chord = new Chord();
                chord.set("view_count", obj.view_count);
                chord.set("search_count", obj.search_count);
                chord.set("state", obj.state);
                chord.set("author_name", obj.author_name);
                chord.set("chord_images", obj.chord_images);
                chord.set("song_name", obj.song_name);
                chord.set("song_poster", obj.song_poster);
                chord.set("collect_count", obj.collect_count || 0);
                chord.set("query", queryString);
                chord.save(null, {
                    success: function (res) {
                        resolve(res)
                    },
                    error: function (res, err) {
                        reject(err)
                    }
                });
            })
        })
        return new Promise((resolve, reject) => {
            Promise.all(promises)
                .then(res => {
                    resolve(res)
                }).catch(err => {
                reject(err)
            })
        })
    },
    // 统计歌曲收藏或取消收藏次数 1：收藏  2：取消收藏
    setCollectNum(id, flag) {
        return new Promise((resolve, reject) => {
            const Guita_info = Bmob.Object.extend("guita_chord_info");
            const query = new Bmob.Query(Guita_info);
            query.get(id, {
                success: function (res) {
                    let num = res.attributes.collect_count;
                    num = flag == 1 ? num + 1 : num - 1;
                    num = num < 0 ? 0 : num;
                    res.set('collect_count', parseInt(num));
                    res.save();
                    resolve(res);
                },
                error: function (object, error) {
                    reject(error);
                }
            });
        })
    },
    // 收藏或取消收藏歌曲  1：收藏  2：取消收藏
    setCollect(openid, songid, flag) {
        return new Promise((resolve, reject) => {
            const Guita_collect = Bmob.Object.extend("guita_collect");
            const chord = new Guita_collect();
            const query = new Bmob.Query(Guita_collect);
            query.equalTo("guita_id", songid);
            chord.set("open_id", openid);
            chord.set("guita_id", songid);
            if (flag == 1) {
                chord.save(null, {
                    success: function (res) {
                        resolve(res)
                    },
                    error: function (res, err) {
                        reject(err)
                    }
                });
            } else if (flag == 2) {
                query.find().then(function (chords) {
                    return Bmob.Object.destroyAll(chords);
                }).then(function (chords) {
                    resolve(chords)
                }, function (error) {
                    reject(error)
                });
            }
        })
    },
    getBanner() {
        return new Promise((resolve, reject) => {
            let Banner = Bmob.Object.extend("banner");
            let query = new Bmob.Query(Banner);
            query.limit(5);
            query.descending('updatedAt');
            query.find({
                success: function (result) {
                    result = result.map(obj => {
                        return {
                            id: obj.id,
                            ...obj.attributes
                        }
                    });
                    resolve(result)
                },
                error: function (result, error) {
                    resolve(error)
                }
            });
        })
    },
    // 增加访问统计
    setViewNum(id) {
        return new Promise((resolve, reject) => {
            const Guita_info = Bmob.Object.extend("guita_chord_info");
            const query = new Bmob.Query(Guita_info);
            query.get(id, {
                success: function (res) {
                    let num = res.attributes.view_count;
                    num += 1;
                    res.set('view_count', parseInt(num));
                    res.save();
                    resolve(res);
                },
                error: function (object, error) {
                    reject(error);
                }
            });
        })
    },
    getComments(songId) {
        return new Promise((resolve, reject) => {
            const Comment = Bmob.Object.extend("comment");

            const query = new Bmob.Query(Comment);
            query.equalTo("songId", songId);

            query.find({
                success: function (result) {
                    console.log(result)
                    result = result.map(obj => {
                        // 注意兼容new Date在ios中与chrome的差异
                        let time = new Date(obj.createdAt.replace(/\s/, 'T')).getTime()
                        return {
                            id: obj.id,
                            createdAt: time,
                            createdAtRecent: Util.toRecentStr(time),
                            ...obj.attributes
                        }
                    });
                    resolve(result)
                },
                error: function (result, error) {
                    resolve(error)
                }
            });
        })
    },
    addComment(obj) {
        return new Promise((resolve, reject) => {
            const Comment = Bmob.Object.extend("comment");
            const comment = new Comment();
            comment.set("songId", obj.songId);
            comment.set("toContent", obj.toContent || "");
            comment.set("toAvatar", obj.toAvatar || "");
            comment.set("to", obj.to || "");
            comment.set("star", 0);
            comment.set("fromAvatar", obj.fromAvatar || "");
            comment.set("from", obj.from || "");
            comment.set("content", obj.content || "");
            comment.save(null, {
                success: function (res) {
                    resolve(res)
                },
                error: function (model, error) {
                    reject(error)
                }
            });
        })
    },

    // 点赞评论或取消点赞评论 openid->用户唯一标识  id -> 评论id
    toggleLoveComment(openid, id) {
        return new Promise((resolve, reject) => {
            const Comment = Bmob.Object.extend("comment");
            const query = new Bmob.Query(Comment);
            query.get(id, {
                success: function (res) {
                    console.log(res)
                    const star_by = res.attributes.star_by || [];
                    let star = res.attributes.star || 0;
                    const index = star_by && star_by.indexOf(openid)
                    if (index === -1) {
                        res.set('star', ++star);
                        star_by.push(openid)
                        res.set('star_by', star_by);
                        res.save().then(res => {
                            resolve({
                                msg: '点赞'
                            })
                        })
                    } else {
                        res.set('star', --star);
                        star_by.splice(index, 1)
                        res.set('star_by', star_by);
                        res.save().then(res => {
                            resolve({
                                msg: '取消点赞'
                            })
                        })
                    }
                },
                error: function (object, error) {
                    reject(error);
                }
            });
        })

    },
    submitFeedback(contact, feedback) {
        return new Promise((resolve, reject) => {
            const Feedback = Bmob.Object.extend("feedback");
            const feedbackIns = new Feedback();
            feedbackIns.set("contact", contact);
            feedbackIns.set("feedback", feedback);
            feedbackIns.save(null, {
                success: function (res) {
                    resolve(res)
                },
                error: function (result, err) {
                    reject(err)
                }
            });
        })
    },
    /**
     * 根据用户openId获取收藏歌曲id集合
     * @param {string} openId 用户id
     */
    getCollectChordsById(openId) {
        return new Promise((resolve, reject) => {
            const Guita_collect = Bmob.Object.extend("guita_collect");
            const query = new Bmob.Query(Guita_collect);
            query.equalTo("open_id", openId);
            query.find({
                success: function (result) {
                    result = result.map(obj => {
                        return obj.attributes.guita_id
                        /* return {
                          id: obj.id,
                          ...obj.attributes
                        } */
                    });
                    resolve(result)
                },
                error: function (result, error) {
                    resolve(error)
                }
            });
        })
    },
    /**
     * 根据歌曲id获取收藏列表
     * @param {array} idArr 歌曲id集合
     */
    getCollectChords(idArr) {
        return new Promise((resolve, reject) => {
            const Guita_info = Bmob.Object.extend("guita_chord_info");
            const query = new Bmob.Query(Guita_info);
            query.descending('updatedAt');
            query.containedIn("objectId", idArr);
            query.find({
                success: function (result) {
                    result = result.map(obj => {
                        return {
                            id: obj.id,
                            ...obj.attributes
                        }
                    });
                    resolve(result)
                },
                error: function (error) {
                    reject(error)
                }
            });
        })
    }
}