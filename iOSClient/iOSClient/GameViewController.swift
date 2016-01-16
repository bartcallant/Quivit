//
//  GameViewController.swift
//  iOSClient
//
//  Created by Bart Callant on 19/11/15.
//  Copyright © 2015 Bart Callant. All rights reserved.
//

import UIKit
import Socket_IO_Client_Swift
import SwiftyJSON

class GameViewController: UIViewController, EILIndoorLocationManagerDelegate
{
	@IBOutlet weak var indoorLocationView: EILIndoorLocationView!
	
	var quivit = Quivit()
	
	var location:EILLocation?
	let indoorLocationManager = EILIndoorLocationManager()
	var socket:SocketIOClient?
	
	override func viewDidLoad()
	{
		super.viewDidLoad()
		// Do any additional setup after loading the view, typically from a nib.
		
		ESTConfig.setupAppID(self.quivit.estimoteAppID, andAppToken: self.quivit.estimoteAppToken)
		ESTConfig.isAuthorized()
		
		self.indoorLocationManager.delegate = self
		
		if let m = self.quivit.match, _ = self.quivit.selectedTeam, _ = self.quivit.selectedPlayer
		{
			print(m["estimoteLocationId"])
			
			let request = EILRequestFetchLocation(locationIdentifier: m["estimoteLocationId"].string)
			request.sendRequestWithCompletion({(location, error) in
				self.location = location
				self.indoorLocationView.drawLocation(location)
				self.indoorLocationManager.startPositionUpdatesForLocation(location)
			})
			
			
			self.socket = SocketIOClient(socketURL: "http://\(self.quivit.host):\(self.quivit.port)")
			self.socket!.on("connect") {data, ack in
				print("[Socket] Connected")
			}
			self.socket!.connect()
			
			print("unwrapping complete")
		}
		else { Quivit.showAlert(self, title: "No match selected!", message: "Please select a match first!") }
	}
	
	override func viewWillAppear(animated: Bool)
	{
		self.indoorLocationView.backgroundColor = UIColor.clearColor()
		self.indoorLocationView.showTrace = true
		self.indoorLocationView.showWallLengthLabels = true
		self.indoorLocationView.rotateOnPositionUpdate = true
		
		self.indoorLocationView.locationBorderColor = UIColor.blackColor()
		self.indoorLocationView.locationBorderThickness = 6
		self.indoorLocationView.doorColor = UIColor.brownColor()
		self.indoorLocationView.doorThickness = 5
		self.indoorLocationView.traceColor = UIColor.yellowColor()
		self.indoorLocationView.traceThickness = 2
		self.indoorLocationView.wallLengthLabelsColor = UIColor.blackColor()
	}
	override func viewWillDisappear(animated: Bool)
	{
		self.indoorLocationManager.stopPositionUpdates()
	}
	
	func indoorLocationManager(manager: EILIndoorLocationManager!, didUpdatePosition position: EILOrientedPoint!, withAccuracy positionAccuracy: EILPositionAccuracy, inLocation location: EILLocation!)
	{
		print("[IndoorLocationManager] Player: \(self.quivit.selectedPlayer!)")
		print("[IndoorLocationManager] Position: x:\(position.x) y:\(position.y) orientation:\(position.orientation)")
		print("[IndoorLocationManager] Location: \(location.name)")
		
		self.indoorLocationView.updatePosition(position)
		
		let eli = self.quivit.match!["estimoteLocationId"].string!
		let pi = self.quivit.selectedPlayer!["_id"].string!
		let ti = self.quivit.selectedPlayer!["teamId"].string!
		let kn = self.quivit.selectedPlayer!["kitNumber"].string!
		let gi = self.quivit.match!["_id"].string!
		let date = NSDate().timeIntervalSince1970
		
		// msgObject.x, msgObject.y, msgObject.orientation, msgObject.timestamp, msgObject.estimoteLocationId, msgObject.playerId, msgObject.teamId, msgObject.gameId
		self.socket!.emit("position", ["x": position.x, "y": position.y, "orientation": position.orientation, "timestamp": date, "estimoteLocationId": eli, "playerId": pi, "kitNumber": kn, "teamId": ti, "gameId": gi])
	}
	
	func indoorLocationManager(manager: EILIndoorLocationManager!, didFailToUpdatePositionWithError error: NSError!)
	{
		print("[IndoorLocationManager] Did fail to update Position! Error: \(error)")
	}
}