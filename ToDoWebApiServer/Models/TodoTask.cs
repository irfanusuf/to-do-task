using System;
using System.Text.Json.Serialization;
using MongoDB.Bson;
using ToDoWebApi.Type;

namespace ToDoWebApi.Models;

public class TodoTask
{

    public ObjectId Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public DateTime DueDate { get; set; }
    public Status Status { get; set; }

}

