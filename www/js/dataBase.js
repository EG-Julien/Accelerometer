angular.module('starter.services', ['ngCordova'])
  .factory('recordDataBase', function ($cordovaSQLite, $ionicPlatform) {
    var db, dbName = "records.db"

    function useWebSql() {
      db = window.openDatabase(dbName, "1.0", "Note database", 200000)
      console.info('Using webSql')
    }

    function useSqlLite() {
      db = $cordovaSQLite.openDB({name: dbName})
      console.info('Using SQLITE')
    }

    function initDatabase(){
      $cordovaSQLite.execute(db, 'CREATE TABLE IF NOT EXISTS T_RECORD (id integer primary key, x, y, z, time)')
        .then(function(res){

        }, onErrorQuery)
    }

    $ionicPlatform.ready(function () {
      if(window.cordova){
        useSqlLite()
      } else {
        useWebSql()
      }

      initDatabase()
    })

    function onErrorQuery(err){
      console.error(err)
    }

    return {
      createRecord: function (record) {
        return $cordovaSQLite.execute(db, 'INSERT INTO T_RECORD (title, content) VALUES(?, ?)', [note.title, note.content])
      },
      updateRecord: function(note){
        return $cordovaSQLite.execute(db, 'UPDATE T_RECORD set title = ?, content = ? where id = ?', [note.title, note.content, note.id])
      },
      getAll: function(callback){
        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, 'SELECT * FROM T_RECORD').then(function (results) {
            var data = []

            for (i = 0, max = results.rows.length; i < max; i++) {
              data.push(results.rows.item(i))
            }

            callback(data)
          }, onErrorQuery)
        })
      },

      deleteNote: function(id){
        return $cordovaSQLite.execute(db, 'DELETE FROM T_NOTE where id = ?', [id])
      },

      getById: function(id, callback){
        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, 'SELECT * FROM T_NOTE where id = ?', [id]).then(function (results) {
            callback(results.rows.item(0))
          })
        })
      }
    }
  })