import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { MatchView } from './match-view.model'; // Import the new model

@Injectable()
export class MatchViewService implements OnModuleInit {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(MatchView.name) private readonly matchViewModel: Model<MatchView>
  ) { }

  async createMatchView() {
    try {
      // listCollections returns a cursor, so we need to convert it to an array
      const collections = await this.connection.db.listCollections().toArray();
      const existingView = collections.find(col => col.name === 'matchView');

      if (existingView) {
        // If it already exists, just skip creation
        console.log('⚠️ matchView already exists. Skipping creation...');
        return;
      }

      await this.connection.db.command( {
        create: "matchView",
        viewOn: 'matches',
        pipeline: [
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'user',
            },
          },
          {
            $unwind: { path: '$user', preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: 'locations',
              localField: 'location',
              foreignField: '_id',
              as: 'location',
            },
          },
          {
            $unwind: { path: '$location', preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: 'sportmodes',
              localField: 'sportMode',
              foreignField: '_id',
              as: 'sportMode',
            },
          },
          {
            $unwind: { path: '$sportMode', preserveNullAndEmptyArrays: true },
          },
          {
            $lookup: {
              from: 'sports',                 // Colección "sports"
              localField: 'sportMode.sport', // Campo donde está el _id de Sport
              foreignField: '_id',           // Se compara con _id de la colección "sports"
              as: 'sport',                   // Nombre del campo resultante
            },
          },
          {
            $unwind: { path: '$sport', preserveNullAndEmptyArrays: true },
          },
        ],
      });

      console.log('✅ View matchView creada exitosamente');
    } catch (error: any) {
      if (error.codeName === 'NamespaceExists') {
        console.log('⚠ La vista matchView ya existe');
      } else {
        console.error('❌ Error creando la view:', error);
      }
    }
  }

  async findAll(filter: any): Promise<MatchView[]> {
    // Use the model's find method for querying the view.
    const results = await this.matchViewModel.find(filter).exec();
    console.log(results);
    return results;
  }

  async onModuleInit() {
    await this.createMatchView();
  }
  
}