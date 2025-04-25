import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddTask, GetAllTasks } from "../../Redux/task/task.action";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const Dashboard = () => {
  const [task, setTask] = useState("");
  const dispatch = useDispatch();
  

  const { AllTasks, isTasksLoading, isTasksError } = useSelector(
    (state) => state.Task
  );

  useEffect(() => {
    dispatch(GetAllTasks());
  }, [dispatch]);

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(AddTask({ task }));
    setTask("");
  };

  return (
    <>
      <Box
        width={"40%"}
        mx={"auto"}
        mt={8}
        border={"1px solid rgb(117, 120, 128)"}
        boxShadow={"rgba(141, 138, 138, 0.24) 0px 3px 8px"}
        borderRadius={"10px"}
        p={"20px"}
      >
        <Typography variant="h4" mb={4}>
          <MenuBookIcon />
          Note App
        </Typography>
        <Box
          component="form"
          onSubmit={handleSave}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            mb: "2rem",
          }}
        >
          <TextField
            fullWidth
            type="text"
            placeholder="Enter todo"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#91410e",
              "&:hover": { backgroundColor: "#722f0b" },
            }}
          >
            +Add
          </Button>
        </Box>

        <Typography variant="h6" borderBottom={"2px solid rgb(200, 202, 207)"}>
          Notes
        </Typography>

        <Box
          height={"50vh"}
          overflow={"auto"}
          sx={{
            scrollbarColor: "#b98666 transparent",
            scrollbarWidth: "thin",
          }}
        >
          {isTasksLoading ? (
            <Typography
              sx={{
                textAlign: "center",
              }}
              mt={"2rem"}
              variant="h5"
            >
              Loading........
            </Typography>
          ) : isTasksError ? (
            <Typography
              sx={{
                textAlign: "center",
              }}
              mt={"2rem"}
              variant="h5"
            >
              Something went wrong
            </Typography>
          ) : (
            Array.isArray(AllTasks?.tasks) &&
            AllTasks?.tasks?.map((task) => (
              <Box
                key={task._id}
                sx={{
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                  borderBottom: "2px solid rgb(200, 202, 207)",
                  alignContent: "center",
                }}
              >
                {task.task}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
