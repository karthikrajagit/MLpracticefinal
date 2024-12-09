import axios from "axios";
import WebSocket from "ws";  // Add WebSocket

export const compile = async (req, res, next) => {
  const { code } = req.body;

  try {
    // Step 1: Create a new kernel
    const kernelResponse = await axios.post('http://localhost:8888/api/kernels', {}, {
      headers: {
        Authorization: `Token bea5ffaa158c95fdff3c7f00664bb365fbc5b1f382b6e375`
      }
    });
    const kernelId = kernelResponse.data.id;
    console.log('Kernel created with ID:', kernelId);

    // Step 2: Open a WebSocket connection to the kernel
    const wsUrl = `ws://localhost:8888/api/kernels/${kernelId}/channels?token=bea5ffaa158c95fdff3c7f00664bb365fbc5b1f382b6e375`;
    const ws = new WebSocket(wsUrl);

    // Step 3: Send the code to be executed in the IPython kernel
    const message = {
    
        header: {
          msg_id: "unique_msg_id", 
          username : "user", 
           session: "unique_session_id", 
          msg_type: "execute_request", 
          version: "5.0"
        },
        parent_header: {},
        metadata: {},
        channel: "shell",  // Explicitly specify the channel (likely 'shell')
        content: {
          code: "a = 10;\r\nb = 20;\r\nprint(a+b);",  // Your Python code to be executed
          silent: false,
          store_history: true,
          user_expressions: {},
          allow_stdin: false
        }
    }
      

    // Step 4: Listen for WebSocket responses
    ws.on("open", () => {
      ws.send(JSON.stringify(message));  // Send the code to be executed
    });

    // Step 5: Handle the kernel response
    ws.on("message", (data) => {
      const response = JSON.parse(data);
      if (response.msg_type === "execute_result") {
        const output = response.content.data['text/plain'];
        ws.close();
        return res.json({ output });
      }
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      next(error);
    });

  } catch (error) {
    return next(error);
  }
};
