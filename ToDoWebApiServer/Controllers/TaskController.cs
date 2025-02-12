using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using ToDoWebApi.Models;
using ToDoWebApi.Type;

namespace ToDoWebApi.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {

        private readonly MongoDbService dbService;

        public TaskController(MongoDbService dbService)
        {
            this.dbService = dbService;
        }


        [HttpPost("CreateTask")]
        public async Task<IActionResult> CreateTask([FromBody] TodoTask task, [FromQuery] int? hours = 12)
        {
            try
            {
                
                if (string.IsNullOrWhiteSpace(task.Title))
                {
                    return BadRequest(new { Message = "Title is required." });
                }

                if (string.IsNullOrWhiteSpace(task.Description))
                {
                    return BadRequest(new { Message = "Description is required." });
                }

               
                int timeLimit = hours.HasValue && hours > 0 ? hours.Value : 12;
                task.DueDate = DateTime.UtcNow.AddHours(timeLimit).AddMinutes(330);

             
                task.Status = Status.Pending;

                await dbService.Task.InsertOneAsync(task);
                return Ok(new
                {
                    Message = "Task created successfully",
                    Task = new
                    {
                        Id = task.Id.ToString(),
                        task.Title,
                        task.Description,
                        task.DueDate,
                        taskStatus = task.Status.ToString()
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new
                {
                    Message = "Server Error",
                    Error = ex.Message
                });
            }
        }


        [HttpDelete("DeleteTask/{id}")]
        public async Task<IActionResult> DeleteTask(string id)
        {

            if (!ObjectId.TryParse(id, out ObjectId objectId))
            {
                return BadRequest(new { Message = "Invalid Task ID format" });
            }
            try
            {

                var task = await dbService.Task.Find(t => t.Id == objectId).FirstOrDefaultAsync();

                if (task == null)
                {
                    return NotFound(new { Message = "Task not found" });
                }

                if (task.Status != Status.Completed)
                {
                    return BadRequest(new { Message = "Task is not complete!" });
                }

                var filter = Builders<TodoTask>.Filter.And(
                     Builders<TodoTask>.Filter.Eq(t => t.Id, objectId),
                     Builders<TodoTask>.Filter.Eq(t => t.Status, Status.Completed)
                    );
                var result = await dbService.Task.DeleteOneAsync(filter);
                if (result.DeletedCount > 0)
                    return Ok(new { Message = "Task deleted successfully" });

                return NotFound(new { Message = "Some Error" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Server Error", Error = ex.Message });
            }
        }



        [HttpPut("UpdateTaskStatus/{id}")]
        public async Task<IActionResult> UpdateTaskStatus(string id, [FromBody] JsonElement changeStatus)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
            {
                return BadRequest(new { Message = "Invalid Task ID format" });
            }

            try
            {
                string statusString = changeStatus.GetString();

                if (!Enum.TryParse<Status>(statusString, true, out Status status))
                {
                    return BadRequest(new { Message = "Only Put Allowed values: Pending, InProgress, Completed" });
                }

                var filter = Builders<TodoTask>.Filter.Eq(t => t.Id, objectId);
                var update = Builders<TodoTask>.Update.Set(t => t.Status, status);

                var result = await dbService.Task.UpdateOneAsync(filter, update);

                if (result.ModifiedCount > 0)
                {
                    return Ok(new { Message = "Task status updated successfully", TaskId = id, NewStatus = status.ToString() });
                }

                return NotFound(new { Message = "Task not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Server Error", Error = ex.Message });
            }
        }



    }
}
