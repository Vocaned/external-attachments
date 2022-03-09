/** @type {import('../../../fake_node_modules/powercord/entities/').default} */
const { Plugin } = require('powercord/entities');
const { getModule } = require("powercord/webpack");
const { get } = require('powercord/http')
const { channels } = require('powercord/webpack');

class ExternalAttachments extends Plugin {
    async startPlugin() {
        powercord.api.commands.registerCommand({
            command: 'attachment',
            aliases: ['upload'],
            description: 'Adds an attachment from an url.',
            usage: '{c} [URL]',
            executor: args => this.upload(args)
        });
    }

    async upload(args) {
        const uploads = await getModule(['setUploads']);
        const channelId = channels.getChannelId()

        let uri = args.join(' ');
        let request = await get(encodeURI(uri));
        let filename = uri.match(/(?:.+\/)([^#?]+)/)[1];
        let contentType = request.headers['content-type'] || '';

        uploads.addFiles({
            channelId: channelId,
            draftType: 0,
            showLargeMessageDialog: false,
            files: [{
                file: new File([ request.body ], filename, {type: contentType}),
                platform: 1
            }]
        });
    }

    pluginWillUnload() {
        powercord.api.commands.unregisterCommand('attachment');
    }
}

module.exports = ExternalAttachments;