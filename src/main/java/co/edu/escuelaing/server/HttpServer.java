package co.edu.escuelaing.server;

import co.edu.escuelaing.config.ServerConfig;
import co.edu.escuelaing.utils.Logger;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Servidor HTTP basado en TCP que acepta conexiones y las delega a ConnectionHandler.
 * Utiliza virtual threads (Java 21) para concurrencia.
 */
public class HttpServer {

    private final ServerConfig config;
    private final ExecutorService executor;
    private volatile boolean running = true;

    public HttpServer(ServerConfig config) {
        this.config = config != null ? config : ServerConfig.createDefault();
        this.executor = Executors.newVirtualThreadPerTaskExecutor();
    }

    public HttpServer(int port) {
        this(ServerConfig.withPort(port));
    }

    public void start() {
        try (ServerSocket serverSocket = new ServerSocket(config.getPort())) {
            Logger.info("HTTP Server started on port " + config.getPort());
            while (running) {
                Socket clientSocket = serverSocket.accept();
                executor.submit(new ConnectionHandler(clientSocket));
            }
        } catch (IOException e) {
            Logger.error("Failed to start server: " + e.getMessage());
        }
    }

    public void stop() {
        running = false;
        executor.shutdown();
    }
}
