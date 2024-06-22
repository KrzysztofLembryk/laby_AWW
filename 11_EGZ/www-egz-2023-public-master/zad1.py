"""
Zalążek do rozwiązania zadania. Proszę wpisać imię i nazwisko
"""

from fastapi import FastAPI, Request

app = FastAPI()

# TODO: tutaj nalezy zdefiniować importy, funkcje, klasy


@app.get("/sentence_count")
async def sentence_count(request: Request, seed: int):
    #TODO
    pass

class LinkCount(BaseModel):
    #TODO
    pass


@app.get("/link_count")
async def link_count(request: Request, seed: int) -> LinkCount:
    # TODO
    pass

class SeedList(BaseModel):
    #TODO
    pass
    

class PageContentList(BaseModel):
    #TODO
    pass
    

@app.post("/all_pages_and_sentences")
async def all_pages_and_sentences(request: Request, seeds: SeedList) -> PageContentList:
    #TODO
    pass

@app.get("/all_pages_and_sentences_k")
async def all_pages_and_sentences_k(
    request: Request, seed: int, k: int
) -> PageContentList:
    assert k <= 3
    #TODO
