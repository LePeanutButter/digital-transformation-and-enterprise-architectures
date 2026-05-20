# Digital Transformation and Enterprise Architectures - Portfolio

[![readme style: standard](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

## **Description**

A curated portfolio of academic labs, applied exercises, and reference architectures focused on digital transformation and enterprise-grade design patterns developed for the Digital Transformation and Enterprise Architecture (TDSE) course at Escuela Colombiana de Ingeniería. Contents include Java micro‑frameworks, serverless APIs, containerized CI/CD pipelines, LangChain RAG experiments, and reproducible ML/AI notebooks. Each folder is a self-contained study, demonstration, or lab with architecture notes and execution evidence.

## **Table of Contents**

- [Description](#description)
- [Background](#background)
- [Project Structure](#project-structure)
- [Install](#install)
- [Usage](#usage)
- [Contributors](#contributors)
- [License](#license)

## **Background**

This repository aggregates semester labs and independent studies that demonstrate methodologies and architectures used in digital transformation projects: lightweight web frameworks and IoC containers (Java), retrieval‑augmented generation (RAG) pipelines with LangChain, container orchestration with Docker and Swarm, serverless API design on AWS, secure two‑tier web apps, and ML experiments executed locally and in cloud notebooks.

Each subfolder contains a focused deliverable: implementation code, diagrams, a README with architecture and run instructions, and evidence (screenshots, notebooks). The collection is intended for academic review, portfolio presentation, and as a reference for implementing similar patterns in production projects.

## **Project Structure**

```text
digital-transformation-and-enterprise-architectures/
├── concurrent-java-webserver-docker/
├── convolutional-layers-through-data-and-experiments/
├── heart-disease-risk-prediction/
├── ioc-web-framework/
├── lambda-web-framework/
├── langchain-llm-chain-basics/
├── langchain-rag-pinecone/
├── llm-text-preprocessing-foundations/
├── municipal-citizen-request-platform/
├── regression-and-cloud-ready-ai-infrastructure/
├── secure-app-architecture-aws/
├── serverless-java-api-aws/
└── twitter-like-application/
```

The tree above shows the main portfolio modules at the repository root. Each folder contains its own README, assets, and implementation artifacts.

## **Install**

This root README does not unify module builds. To run a module, change into its folder and follow its README. Common tools used across modules:

- Java 17/21 and Maven (`mvn clean package`, `mvn test`, `mvn exec:java`)
- Docker and Docker Compose for container labs
- Python 3.10+ and Jupyter for LangChain and ML notebooks
- AWS CLI and an AWS account for deployment labs (EC2, Lambda, SageMaker)

## **Usage**

Navigate to a module folder and follow that module's README for step‑by‑step instructions. High‑level module index (folder → purpose):

- `concurrent-java-webserver-docker` — Java 21 microframework extended with virtual threads, Docker multi‑stage build, Nginx load balancer, and GitHub Actions CI/CD for EC2 deployment.
- `ioc-web-framework` — Annotation-driven IoC micro‑framework (`@RestController`, `@GetMapping`) with controller scanning and reflection-based routing.
- `lambda-web-framework` — Lightweight Java web framework from sockets to REST and static file serving; includes tests and usage examples.
- `serverless-java-api-aws` — Java Lambda + API Gateway examples demonstrating JSON body mapping and realistic endpoints.
- `langchain-rag-pinecone` — Retrieval‑Augmented Generation pipeline using LangChain, OpenAI/Gemini embeddings, and Pinecone vector store (notebook-based walkthrough).
- `langchain-llm-chain-basics` — Foundational LangChain LLM chain tutorial preparing for RAG architectures.
- `llm-text-preprocessing-foundations` — Notebook reproducing embedding and sliding-window pipelines for tokenized language model training.
- `convolutional-layers-through-data-and-experiments` — CNN architecture experiments using MNIST with interpretive analysis and SageMaker deployment notes.
- `regression-and-cloud-ready-ai-infrastructure` — Linear and polynomial regression notebooks executed in SageMaker with execution evidence.
- `heart-disease-risk-prediction` — Logistic regression from scratch on clinical dataset with evaluation and packaging instructions.
- `secure-app-architecture-aws` — Two‑tier AWS deployment (Apache + Spring Boot) demonstrating TLS, BCrypt, and token authentication.
- `municipal-citizen-request-platform` — Capstone study: modular monolith architecture, financial and agile planning, and an academic paper for municipal service delivery.
- `twitter-like-application` — Secure Twitter‑like app (monolith → serverless microservices) with Auth0 integration and SAM/SAM templates.

Sensitive or private items found in module READMEs (local file paths, private video links, or secrets) have been generalized in this root summary. Refer to individual module READMEs for sanitized evidence and further detail.

## **Contributors**

Each project in this portfolio has different contributors, as reflected in the corresponding module README files.

## **License**

Licenses are module-scoped. Some modules include specific licenses (e.g., MIT). Before reusing code in production, inspect the subproject's README/LICENSE file for exact terms.
