import typer
import uvicorn

app_cli = typer.Typer()


@app_cli.command()
def cli(
    host: str = "localhost", port: int = 9456, root_path: str = "", workers: int = 1
):
    """Backend client launcher with developer configuration."""
    uvicorn.run(
        "app_backend.app_api:app",
        host=host,
        port=port,
        root_path=root_path,
        workers=workers,
        reload=True,
    )