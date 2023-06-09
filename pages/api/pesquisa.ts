import type {NextApiRequest, NextApiResponse} from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import { conectarMongoDB } from '../../middlewares/conectaMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { UsuarioModel } from '../../models/UsuarioModel';

const pesquisaEndpoint =  async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any []>) => {

    try {
        if (req.method === 'GET'){
                if(req?.query?.id){

                    const usuarioEncontrado = await UsuarioModel.findById(req?.query?.id);
                        if(!usuarioEncontrado){
                            return res.status(400).json({erro : 'Usuário não Encontrado' });
                            
                        }

                                return res.status(200).json(usuarioEncontrado);

                }else{
                   
                    const {filtro} = req.query;

                if(!filtro || filtro.length < 2) {

                        return res.status(400).json({erro : 'Favor informar pelo menos dois caracteres para busca.'})
                }

                const usuariosEncontrados = await UsuarioModel.find ({
                    $or: [{nome : {$regex : filtro, $options: 'i'}}, 
                        //{email : {$regex : filtro, $options: 'i'}}
                         ]
                });

                return res.status (200).json(usuariosEncontrados);
        }   

                }
                
        return res.status(405).json({erro : 'Método informado não é válido.'});

    }catch(e){

        console.log(e);
        return res.status(500).json({erro : 'Não foi possivel buscar Usuários' + e});
    }

}

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint));