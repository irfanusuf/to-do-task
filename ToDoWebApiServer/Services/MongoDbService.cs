
using MongoDB.Driver;


namespace ToDoWebApi.Models;

public class MongoDbService
{

    private readonly IMongoDatabase _database;    // inheritance 
                                                  // function which takes connection string from config and establishes a connection with mongodb server 

   // ctor
    public MongoDbService(IConfiguration configuration)
    {

        var connectionString = configuration["MongoDB:ConnectionString"];  // importing connection strting 
        var databaseName = configuration["MongoDB:DatabaseName"];     //importing data base name from appsettings

        var client = new MongoClient(connectionString);
        
        var database = client.GetDatabase(databaseName);

        _database = database;

    }


    public IMongoCollection<TodoTask> Task => _database.GetCollection<TodoTask>("Task");



}



