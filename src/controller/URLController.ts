import { Request, Response } from "express";
import shortId from 'shortid';
import { config } from "../config/Constants";
import { URLModel } from '../database/model/URL';

export class URLController {
    public async shorten(req: Request, response: Response): Promise<void> {
        //ver se a url ja nao existe
        const { originURL } = req.body;
        const url = await URLModel.findOne({ originURL });
        if (url) {
            response.json(url)
            return
        }
        //criar o hash para essa url
        const hash = shortId.generate();
        const shortURL = `${config.API_URL}/${hash}`;
        //salvar a url no banco
        const newURL = URLModel.create({ hash, shortURL, originURL });
        //retornar a url que a gente salvou
        response.json(newURL);
    }

    public async redirect(req: Request, response: Response): Promise<void> {
        //pegar hash da url
        const { hash } = req.params
        const url = await URLModel.findOne({ hash });
        //redirecionar para a url original a partir do que encontrar no DB
        if (url) {
            response.redirect(url.originURL)
            return
        }

        response.status(400).json({ error: " URL not found "})
    }
}