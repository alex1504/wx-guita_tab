import Bmob from '../utils/bmob';
module.exports = {
  getChords() {
    return new Promise((resolve, reject) => {
      var Guita_info = Bmob.Object.extend("guita_chord_info");
      var query = new Bmob.Query(Guita_info);
      query.find({
        success: function (result) {
          result = result.map(obj => {
            return {
              id:obj.id,
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
          resolve(result.attributes)
        },
        error: function (result, error) {
          resolve(error)
        }
      });
    })
  }



}