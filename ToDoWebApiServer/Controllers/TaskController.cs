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
        public async Task<IActionResult> CreateTask([FromBody] TodoTask task)
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

                if (task.DueDate == default) 
                {
                    task.DueDate = DateTime.UtcNow.AddHours(12);
                }

                task.Status = "Pending";

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
                        taskStatus = task.Status
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, new { Message = "Server Error", Error = ex.Message });
            }
        }



        [HttpGet("GetAllTasks")]
        public async Task<IActionResult> GetAllTasks()
        {
            try
            {
                var tasks = await dbService.Task.Find(_ => true).ToListAsync();


                var formattedTasks = tasks.Select(task => new
                {
                    Id = task.Id.ToString(),
                    task.Title,
                    task.Description,
                    task.DueDate,
                    task.Status
                });
                return Ok(new { Message = "Tasks fetched successfully", Tasks = formattedTasks });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Server Error", Error = ex.Message });
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

                if (task.Status != "Completed")
                {
                    return BadRequest(new { Message = "Task is not complete!" });
                }

                var filter = Builders<TodoTask>.Filter.And(
                     Builders<TodoTask>.Filter.Eq(t => t.Id, objectId),
                     Builders<TodoTask>.Filter.Eq(t => t.Status, task.Status)
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
        public async Task<IActionResult> UpdateTaskStatus(string id, [FromQuery] string status)
        {
            if (!ObjectId.TryParse(id, out ObjectId objectId))
            {
                return BadRequest(new { Message = "Invalid Task ID format" });
            }

            if (string.IsNullOrEmpty(status))
            {
                return BadRequest(new { Message = "Status is required" });
            }

            try
            {
                var filter = Builders<TodoTask>.Filter.Eq(t => t.Id, objectId);
                var update = Builders<TodoTask>.Update.Set("Status", status);

                var result = await dbService.Task.UpdateOneAsync(filter, update);

                if (result.ModifiedCount > 0)
                {
                    return Ok(new { Message = "Task status updated successfully", TaskId = id, NewStatus = status });
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
