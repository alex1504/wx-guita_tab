import Bmob from '../utils/bmob';
module.exports = {
  getChords(page) {
    page = typeof page == 'undefine' ? 1 : page;
    page = parseInt(page);
    return new Promise((resolve, reject) => {
      let Guita_info = Bmob.Object.extend("guita_chord_info");
      let query = new Bmob.Query(Guita_info);
      let limit = 10;
      query.limit(limit);
      query.skip((page - 1) * limit);
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
  getChordById(id) {
    return new Promise((resolve, reject) => {
      var Guita_info = Bmob.Object.extend("guita_chord_info");
      var query = new Bmob.Query(Guita_info);
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
  searchChord(song_name) {
    return new Promise((resolve, reject) => {
      var Guita_info = Bmob.Object.extend("guita_chord_info");
      var query = new Bmob.Query(Guita_info);
      query.equalTo("song_name", song_name);
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
  setSongFlag(id,flag) {
    return new Promise((resolve, reject) => {
      var Guita_info = Bmob.Object.extend("guita_chord_info");
      var query = new Bmob.Query(Guita_info);
      query.get(id, {
        success: function (res) {
          res.set('love_flag', parseInt(flag));
          res.save();
          resolve(res);
        },
        error: function (object, error) {
          reject(error);
        }
      });
    })
  },


}